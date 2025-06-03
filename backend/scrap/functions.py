from email.message import EmailMessage
import smtplib
import time
import requests
from bs4 import BeautifulSoup
import pandas as pd
import datetime
import os
import mariadb
from decimal import Decimal
import sys
import re
import unicodedata

today = datetime.datetime.now()

Error_Descripcion=[]
Error_Codigo=[]
Error_Detalle=[]
Error_Linea=[]
Error_SQL=[]
contador=0
inicio_tienda=None
fin_tienda=None

# Configuración de la conexión a MariaDB
db_config = {
    'user': 'juampi',
    'password': 'Juampi2705',
    'host': '10.0.2.15',
    'port': 3306,
}

class Data_base:
    @staticmethod
    def crear_base_de_datos():
        """
        Crea la base de datos y todas las tablas normalizadas (3NF).
        """
        try:
            temp = db_config.copy()
            temp.pop('database', None)
            cnn = mariadb.connect(**temp)
            cur = cnn.cursor()
            cur.execute("CREATE DATABASE IF NOT EXISTS test_supermercados CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            cur.execute("USE test_supermercados;")

            cur.execute("""
            CREATE TABLE IF NOT EXISTS Category (
            category_id  INT AUTO_INCREMENT PRIMARY KEY,
            category     VARCHAR(100) NOT NULL,
            subcategory  VARCHAR(100) NOT NULL,
            UNIQUE KEY uq_cat_sub (category, subcategory)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """)


            cur.execute("""
            CREATE TABLE IF NOT EXISTS Product (
              ean          VARCHAR(100) NOT NULL PRIMARY KEY,
              name          VARCHAR(255) NOT NULL,
              category_id   INT,
              UNIQUE KEY uq_product (name, category_id),
              FOREIGN KEY (category_id)
                REFERENCES Category(category_id)
                ON DELETE SET NULL
                ON UPDATE CASCADE
            );
            """)

            cur.execute("""
            CREATE TABLE IF NOT EXISTS Supermarket (
              supermarket_id INT AUTO_INCREMENT PRIMARY KEY,
              name           VARCHAR(100) NOT NULL UNIQUE
            );
            """)

            cur.execute("""
            CREATE TABLE IF NOT EXISTS ProductPrice (
              ean      VARCHAR(100)     NOT NULL,
              supermarket_id  INT     NOT NULL,
              price           DECIMAL(10,2) NOT NULL,
              PRIMARY KEY (ean, supermarket_id),
              FOREIGN KEY (ean)
                REFERENCES Product(ean)
                ON DELETE CASCADE ON UPDATE CASCADE,
              FOREIGN KEY (supermarket_id)
                REFERENCES Supermarket(supermarket_id)
                ON DELETE CASCADE ON UPDATE CASCADE
            );
            """)

            cnn.commit()
            print("Base de datos y tablas creadas o ya existentes.")
        except mariadb.Error as err:
            print("Error al crear la base de datos o tablas:", err)
        finally:
            cnn.close()

    @staticmethod
    def conectar_db():
        """
        Conecta a la base de datos.
        """
        try:
            cnn = mariadb.connect(**db_config)
            cur = cnn.cursor()
            cur.execute("USE test_supermercados;")
            return cnn, cur
        except mariadb.Error as err:
            print("Error al conectar a la base de datos:", err)
            return None, None

    @staticmethod
    def _get_or_create_category(cur, category, subcategory):
        category    = Data_base._normalize(category)
        subcategory = Data_base._normalize(subcategory)

        cur.execute(
            "SELECT category_id FROM Category WHERE category=%s AND subcategory=%s;",
            (category, subcategory)
        )
        row = cur.fetchone()
        if row:
            return row[0]

        cur.execute(
            "INSERT INTO Category (category, subcategory) VALUES (%s, %s);",
            (category, subcategory)
        )
        return cur.lastrowid

    @staticmethod
    def _get_or_create_product(cur, ean, name, category_id):
        """
        Devuelve el EAN (o el ID, según tu esquema) del producto.
        Si no existe, lo crea.
        """

        # --- 1. validación mínima ---
        if not ean or str(ean).strip() == "":
            raise ValueError(f"EAN vacío o nulo para el producto: {name!r}")

        # --- 2. ¿ya existe? ---
        cur.execute(
            "SELECT ean FROM Product WHERE ean = %s;",
            (ean,)                # ← tupla de 1 elemento
        )
        row = cur.fetchone()
        if row:
            return row[0]         # el EAN existente

        # --- 3. insertar nuevo ---
        cur.execute(
            "INSERT INTO Product (ean, name, category_id) VALUES (%s, %s, %s);",
            (ean, name, category_id)
        )
        # Si el EAN es PK, simplemente devolvemos el mismo valor:
        return ean
        # Si tu PK es un autoincrement 'id', usa:
        # return cur.lastrowid


    @staticmethod
    def _get_or_create_supermarket(cur, name):
        cur.execute("SELECT supermarket_id FROM Supermarket WHERE name=%s;", (name,))
        row = cur.fetchone()
        if row:
            return row[0]
        cur.execute("INSERT INTO Supermarket (name) VALUES (%s);", (name,))
        return cur.lastrowid

    @staticmethod
    def insertar_producto(cur, producto, supermarket_name):
        """
        Inserta (o actualiza) el precio de un producto en un supermercado.
        """
        # convertir y validar precio
        try:
            precio = Decimal(producto['Precio']).quantize(Decimal('0.01'))
        except:
            return  # precio inválido

        # 1. categoría
        cat_id = Data_base._get_or_create_category(cur,producto['Categoria'],producto.get('Subcategoria', ''))
        # 2. producto
        ean = Data_base._get_or_create_product(cur, producto['ean'], producto['Producto'], cat_id)
        # 3. supermercado
        sup_id  = Data_base._get_or_create_supermarket(cur, supermarket_name)
        # 4. precio
        cur.execute("""
            INSERT INTO ProductPrice
              (ean, supermarket_id, price)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE
              price = VALUES(price)
        """, (
            ean,
            sup_id,
            precio
        ))

    @staticmethod
    def _normalize(text: str) -> str:
        """
        Limpia y homogeneiza nombres de categoría/sub-categoría.
        - Quita acentos y caracteres no ASCII
        - Sustituye guiones y underscores por espacios
        - Colapsa espacios repetidos
        - Devuelve en Title Case
        """
        if not text:
            return ''
        text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
        text = re.sub(r'[-_]+', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text.title()
    

class Mail_sender:
    @staticmethod
    def enviar_correo(asunto, mensaje):
        sender_email_address = "jusamso@gmail.com"
        receiver_email_address = "j.samso@alumno.um.edu.ar"
        email_smtp = "smtp.gmail.com"
        email_password = "fduc snfu hfmi fjio"

        # Crear un objeto de mensaje de correo electrónico
        message = EmailMessage()

        # Configurar los encabezados del correo electrónico
        message['Subject'] = asunto
        message['From'] = sender_email_address
        message['To'] = receiver_email_address

        # Establecer el cuerpo del correo electrónico
        message.set_content(mensaje, subtype="html")

        # Configurar el servidor SMTP y el puerto
        server = smtplib.SMTP(email_smtp, '587')

        # Identificar este cliente al servidor SMTP
        server.ehlo()

        # Asegurar la conexión SMTP
        server.starttls()

        # Iniciar sesión en la cuenta de correo electrónico
        server.login(sender_email_address, email_password)

        # Enviar el correo electrónico
        server.send_message(message)

        # Cerrar la conexión con el servidor
        server.quit()

    @staticmethod
    def validador_error(dato, comando):
        """
        Valida y almacena los errores de SQL.
        """
        global Error_Descripcion
        global Error_Codigo
        global Error_Detalle
        global Error_Linea
        global Error_SQL

        print(dato)

        if dato[0] == '1452 (23000)':
            info = dato[2]
            inicio = info.find("FOREIGN KEY (`")
            final = info.find("`) REFERENCES")
            detalle = info[inicio:final + 2]
            print(detalle)
            Error_Descripcion.append(detalle)
            Error_Codigo.append(dato[0])
            Error_Detalle.append(dato[1])
            Error_Linea.append(sys.exc_info()[2].tb_lineno)
            Error_SQL.append(comando)
        else:
            Error_Descripcion.append(sys.exc_info()[0])
            Error_Codigo.append(dato[0])
            Error_Detalle.append(dato[1])
            Error_Linea.append(sys.exc_info()[2].tb_lineno)
            Error_SQL.append(comando)

    @staticmethod
    def reporte_errores_mail(tienda):
        """
        En el caso de que existiese algún error en el guardado a la base de datos, envía un mail con el código del error, el detalle, la descripción y la sentencia SQL que falló.
        """
        global Error_Descripcion
        global Error_Codigo
        global Error_Detalle
        global Error_Linea
        global Error_SQL
        global contador

        if not os.path.exists('Error/'):
            os.makedirs('Error/')
        with open(f"Error/Sql_Error_{tienda}.txt", "w") as file:
            for x in Error_SQL:
                file.write(str(x) + '\n')

        if len(Error_Descripcion) > 0:
            i = 0

            mensaje = (f'<p>Se insertaron {contador} registros</p>'
                       f'<p>Hora de inicio {inicio_tienda}</p>'
                       f'<p>Hora de fin {fin_tienda}</p>'
                       f'<p>Tiempo total {fin_tienda - inicio_tienda}</p>')

            cabecera = ('<thead style="background-color:  #246355; border-bottom:solid 5px ;color: white">'
                        '<tr>'
                        '<th scope="col" style="padding:20px;">Fecha</th>'
                        '<th scope="col" style="padding:20px;">Descripción</th>'
                        '<th scope="col" style="padding:20px;">Código</th>'
                        '<th scope="col" style="padding:20px;">Detalle</th>'
                        '<th scope="col" style="padding:20px;">Linea</th>'
                        '<th scope="col" style="padding:20px;">SQL</th>'
                        '</tr>'
                        '</thead>')

            cuadro_final = ''
            while i <= len(Error_Descripcion) - 1:
                if i % 2 == 0:
                    cuadro = ('<tr>'
                              '<td style="padding:20px;">' + str(today) + '</td>'
                              '<td style="padding:20px;">' + str(Error_Descripcion[i]) + '</td>'
                              '<td style="padding:20px;">' + str(Error_Codigo[i]) + '</td>'
                              '<td style="padding:20px;">' + str(Error_Detalle[i]) + '</td>'
                              '<td style="padding:20px;">' + str(Error_Linea[i]) + '</td>'
                              '<td style="padding:20px;">' + str(Error_SQL[i]) + '</td>'
                              '</tr>')
                else:
                    cuadro = ('<tr>'
                              '<td style="padding:20px;background-color:#ddd;">' + str(today) + '</td>'
                              '<td style="padding:20px;background-color:#ddd;">' + str(Error_Descripcion[i]) + '</td>'
                              '<td style="padding:20px;background-color:#ddd;">' + str(Error_Codigo[i]) + '</td>'
                              '<td style="padding:20px;background-color:#ddd;">' + str(Error_Detalle[i]) + '</td>'
                              '<td style="padding:20px;background-color:#ddd;">' + str(Error_Linea[i]) + '</td>'
                              '<td style="padding:20px;background-color:#ddd;">' + str(Error_SQL[i]) + '</td>'
                              '</tr>')

                cuadro_final = cuadro_final + cuadro
                i += 1

            mensaje = ('<html><head>'
                       '</head>'
                       '<body>'
                       + str(mensaje) +
                       '<table style="background-color: white;text-align: center;border-collapse: collapse;width: 100 %;color: Black;">'
                       + str(cabecera) + '<tbody>' + str(cuadro_final) + '</tbody>'
                       '</table></body></html>')

            email_subject = f"Listado de Errores {tienda}"

        else:
            mensaje = ('<p>Todos los datos pasaron satisfactoriamente</p>'
                       f'<p>Se insertaron {contador} registros</p>'
                       f'<p>Hora de inicio {inicio_tienda}</p>'
                       f'<p>Hora de fin {fin_tienda}</p>'
                       f'<p>Tiempo total {fin_tienda - inicio_tienda}</p>')

            email_subject = f"Base de Datos de {tienda} Actualizada Satisfactoriamente"

        Mail_sender.enviar_correo(email_subject, mensaje)


class Scrap:
    def extraccion(self, url_template, output_file, category, vtex):
        """
        Extrae datos de una página web y los guarda en un archivo de texto.
        """        
        datos = []

        for i in range(1, 51):
            url = url_template.format(i)
            print(url)
            try:
                page = requests.get(url)
                time.sleep(2)
                soup = BeautifulSoup(page.text, "html.parser")
                if vtex == True:
                    error_encontrado = False
                    template = soup.find_all("script")
                    for script in template:
                        if script.string and '{"$ROOT_QUERY.productSearch' in script.string or script.string and '    __STATE__ = {"$ROOT_QUERY' in script.string:
                            print(f"Error en la página {i} de {category}")
                            error_encontrado = True
                            break
                        elif script.string and '{"Product:' in script.string:
                            datos.append(str(script))

                else:
                    error_encontrado = False
                    template = soup.find_all('div' , {'class': 'product-description product__card-desc'})
                    opps = soup.find_all('h4')
                    if len(opps)>0:
                        print(f"Error en la página {i} de {category}")
                        error_encontrado = True
                        break
                    else:
                        datos.append(template)  
                    
                if error_encontrado:
                    break
            except Exception as e:
                print("Error handshake")
                Mail_sender.enviar_correo("Error Handshake", f"Ocurrió un error de handshake al intentar acceder a la URL: {url}. Error: {str(e)}")
                pass
        output_directory = os.path.dirname(output_file)
        if not os.path.exists(output_directory):
            os.makedirs(output_directory)

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(str(datos))


    def encontrar_todas(self, cadena, category, subcategory, subcadena, hasta_nombre, desde_precio, hasta_precio, desde_ean, hasta_ean, vtex):
        """
        Encuentra todas las ocurrencias de productos en los datos extraídos.
        """
        data_acumulada = []

        if vtex == True:
            posicion = 0
            while posicion != -1:
                posicion = cadena.find(subcadena, posicion)
                if posicion == -1:
                    break
                posicion1 = cadena.find(hasta_nombre, posicion) - 2
                posicion_precio = cadena.find(desde_precio, posicion)
                posicion_precio1 = cadena.find(hasta_precio, posicion) - 1
                posicion_ean = cadena.find(desde_ean, posicion)
                posicion_ean1 = cadena.find(hasta_ean, posicion)

                data_acumulada.append({
                    'Producto': cadena[posicion + 15:posicion1],
                    'Precio': cadena[posicion_precio + 8:posicion_precio1],
                    'ean': cadena[posicion_ean + 7:posicion_ean1],
                    'Categoria': category,
                    'Subcategoria': subcategory,
                    'Año': today.year,
                    'Mes': today.month,
                    'Día': today.day,
                })
                posicion += 1

        #atomo
        else:
            posicion = 0
            while posicion != -1:
                posicion = cadena.find ('.html' , posicion)
                if posicion == -1:
                    break

                posicion_inicial =  posicion - 13

                titulo_final = cadena.find ('</a>' , posicion)

                precio_inicial = cadena.find('<span class="price">', posicion)
                precio_final = cadena.find('</span>', precio_inicial)

                # Extraer el precio y realizar las limpiezas necesarias
                precio = cadena[precio_inicial + len('<span class="price">'): precio_final]
                precio = precio.replace('.', '').replace(',', '.').replace('\u00a0', '').replace('$', '').strip()

                data_acumulada.append({
                    'Producto': cadena[posicion + 7: titulo_final ],
                    'Precio': precio,
                    'ean': cadena[posicion_inicial  : posicion ],
                    'Categoria': category,
                    'Subcategoria': subcategory,
                    'Año': today.year,
                    'Mes': today.month,
                    'Día': today.day,
                })
                posicion += 1


        return data_acumulada


    def procesar(self, tienda, departamentos, url_template_departamento, txt_template, busqueda_por_departamento, vtex):
        """
        Procesa los datos extraídos, los guarda en un CSV y luego llama a la funcion que los guarda en la base.
        """
        global contador
        global inicio_tienda

        contador = 0
        inicio_tienda = datetime.datetime.now()

        if not os.path.exists(f'{tienda}/Txt'):
            os.makedirs(f'{tienda}/Txt')

        data_acumulada = []

        if busqueda_por_departamento:
            for category, department  in departamentos.items():
                url_template = url_template_departamento.format(department, category, '{}')
                output_file = txt_template.format(department)
                self.extraccion(url_template, output_file, category, vtex)

                with open(output_file, 'r', encoding='utf-8') as f:
                    data = f.read()

                resultados = self.encontrar_todas(data, department, category, '"productName"', '"productReference"', '"Price":', '"ListPrice":', '"ean":"', '","variations"', vtex)                
                data_acumulada.extend(resultados)

        else:
            for category, department in departamentos.items():
                url_template = url_template_departamento.format(category, '{}')
                output_file = txt_template.format(department)
                self.extraccion(url_template, output_file, department, vtex)

                with open(output_file, 'r', encoding='utf-8') as f:
                    data = f.read()

                resultados = self.encontrar_todas(data, department, category, '"productName"', '"productReference"', '"Price":', '"ListPrice":', '"ean":"', '","variations"', vtex)
                data_acumulada.extend(resultados)

        if not os.path.exists(f'{tienda}/Permanente'):
            os.makedirs(f'{tienda}/Permanente')

        df_acumulado = pd.DataFrame(data_acumulada)
        df_acumulado = df_acumulado.drop_duplicates(subset=['ean'])
        df_acumulado.to_csv(f'{tienda}/Productos.csv', sep=';', encoding='utf-8', index_label='ID')
        df_acumulado.to_csv(f'{tienda}/Permanente/Productos_{today.day}-{today.month}-{today.year}.csv', sep=';', encoding='utf-8', index_label='ID')

        self.insertar_productos_desde_csv(tienda, df_acumulado)


    def insertar_productos_desde_csv(self, tienda, df_acumulado):
        """
        Inserta los productos procesados en la base normalizada.
        """
        global fin_tienda
        cnn, cur = Data_base.conectar_db()
        if not cnn:
            return
        Data_base.crear_base_de_datos()  # asegura que las tablas existan

        for _, row in df_acumulado.iterrows():
            producto = row.to_dict()
            Data_base.insertar_producto(cur, producto, tienda)

        cnn.commit()
        cur.close()
        cnn.close()
        fin_tienda = datetime.datetime.now()
