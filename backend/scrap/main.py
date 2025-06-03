from functions import Data_base, Scrap, Mail_sender



# Parámetros de configuración
config = {
    'LIBERTAD': {
        'departamentos': {
            # 'climatizacion': 'electrodomesticos',
            # 'pequenos-electrodomesticos': 'electrodomesticos',
            # 'lavado': 'electrodomesticos',
            # 'cocinas-y-hornos': 'electrodomesticos',
            # 'heladeras-y-freezers': 'electrodomesticos',
            # 'hogar-y-limpieza': 'electrodomesticos',
            # 'cuidado-personal-y-salud': 'electrodomesticos',
            # 'termotanques-y-calefones': 'electrodomesticos',
            'aceites-y-vinagres': 'almacen',
            # 'aceitunas-y-encurtidos': 'almacen',
            # 'aderezos': 'almacen',
            # 'arroz-y-legumbres': 'almacen',
            # 'caldos-sopas-y-pure': 'almacen',
            # 'conservas': 'almacen',
            # 'desayuno-y-merienda': 'almacen',
            # 'golosinas-y-chocolates': 'almacen',
            # 'harinas': 'almacen',
            # 'sin-tacc': 'almacen',
            # 'panificados': 'almacen',
            # 'para-preparar': 'almacen',
            # 'pastas-secas-y-salsas': 'almacen',
            # 'sal-pimienta-y-especias': 'almacen',
            # 'snacks': 'almacen',
            },
        'url_template_departamento': 'https://www.hiperlibertad.com.ar/{}/{}?page={}',
        'txt_template': 'LIBERTAD/Txt/libertad_{}.txt',
        'busqueda_por_departamento': True,
        'vtex':True,
    },

    'CARREFOUR': {
        'departamentos': {
            # 'smart-tv-y-soportes':'electro-y-tecnologia',
            # 'celulares':'electro-y-tecnologia',
            # 'climatizacion':'electro-y-tecnologia',
            # 'heladeras-y-freezers':'electro-y-tecnologia',
            # 'lavado':'electro-y-tecnologia',
            # 'termotanques-y-calefones':'electro-y-tecnologia',
            # 'cocinas-y-hornos':'electro-y-tecnologia',
            # 'pequenos-electrodomesticos':'electro-y-tecnologia',
            # 'cuidado-personal-y-salud':'electro-y-tecnologia',
            # 'informatica-y-gaming':'electro-y-tecnologia',
            # 'audio':'electro-y-tecnologia',
            'Aceites-y-vinagres': 'Almacen',
            # 'Pastas-secas': 'Almacen',
            # 'Arroz-y-legumbres': 'Almacen',
            # 'Harinas': 'Almacen',
            # 'Enlatados-y-Conservas': 'Almacen',
            # 'Sal-aderezos-y-saborizadores': 'Almacen',
            # 'Caldos-sopas-y-pure': 'Almacen',
            # 'Reposteria-y-postres': 'Almacen',
            # 'Snacks': 'Almacen',
        },
        'url_template_departamento': 'https://www.carrefour.com.ar/{}/{}?page={}',
        'txt_template': 'CARREFOUR/Txt/carrefour_{}.txt',
        'busqueda_por_departamento': True,
        'vtex':True,
    },

    'MASONLINE': {
        'departamentos': {
            'aceites-vinagres-y-aderezos': 'Almacen',
            # 'arroz-legumbres-y-pastas': 'Almacen',
            # 'caldos-sopas-y-pure': 'Almacen',
            # 'condimentos-y-especias': 'Almacen',
            # 'conservas-y-enlatados': 'Almacen',
            # 'desayunos-y-meriendas': 'Almacen',
            # 'harinas': 'Almacen',
            # 'kiosco': 'Almacen',
            # 'panaderia': 'Almacen',
            # 'panificados': 'Almacen',
            # 'reposteria': 'Almacen',
            # 'snacks': 'Almacen',
            # 'climatizacion': 'Electrodomesticos',
            # 'calefones-y-termotanques': 'Electrodomesticos',
            # 'heladeras-y-freezers': 'Electrodomesticos',
            # 'lavado': 'Electrodomesticos',
            # 'limpieza-del-hogar': 'Electrodomesticos',
            # 'pequeños-electrodomesticos': 'Electrodomesticos',
            # 'cocinas-hornos-y-extractores': 'Electrodomesticos',
            # 'electro-belleza': 'Electrodomesticos',
            },
        'url_template_departamento': 'https://www.masonline.com.ar/{}?page={}',
        'txt_template': 'MASONLINE/Txt/masonline_{}.txt',
        'busqueda_por_departamento': False,
        'vtex':True,
    },

    'JUMBO': {
        'departamentos': {
            # 'informatica':'electro',
            # 'calefaccion-calefones-y-termotanques':'electro',
            # 'cocinas-y-hornos':'electro',
            # 'consolas-y-videojuegos':'electro',
            # 'heladeras-freezers-y-cavas':'electro',
            # 'lavado':'electro',
            # 'pequenos-electros':'electro',
            # 'telefonos':'electro',
            # 'tv-y-video':'electro',
            # 'aire-acondicionado-y-ventilacion':'electro',
            # 'audio':'electro',
            'Aceites-y-Vinagres':'Almacen',
            # 'Aderezos':'Almacen',
            # 'Arroz-y-Legumbres':'Almacen',
            # 'Conservas':'Almacen',
            # 'Desayuno-y-Merienda':'Almacen',
            # 'Golosinas-y-Chocolates':'Almacen',
            # 'harinas':'Almacen',
            # 'panificados':'Almacen',
            # 'Para-Preparar':'Almacen',
            # 'pastas-secas-y-salsas':'Almacen',
            # 'Sal-Pimienta-y-Especias':'Almacen',
            # 'snacks':'Almacen',
            # 'caldos-sopas-pure-y-bolsas-para-horno':'Almacen',
        },
        'url_template_departamento': 'https://www.jumbo.com.ar/{}/{}?page={}', 
        'txt_template': 'JUMBO/Txt/jumbo_{}.txt',
        'busqueda_por_departamento': True,
        'vtex':True,
    },

    'VEA': {
        'departamentos': {
            # 'informatica':'electro',
            # 'calefaccion-calefones-y-termotanques':'electro',
            # 'cocinas-y-hornos':'electro',
            # 'consolas-y-videojuegos':'electro',
            # 'heladeras-freezers-y-cavas':'electro',
            # 'lavado':'electro',
            # 'pequenos-electros':'electro',
            # 'telefonos':'electro',
            # 'tv-y-video':'electro',
            # 'aire-acondicionado-y-ventilacion':'electro',
            # 'audio':'electro',
            'Aceites-y-Vinagres':'Almacen',
            # 'Aderezos':'Almacen',
            # 'Arroz-y-Legumbres':'Almacen',
            # 'Conservas':'Almacen',
            # 'Desayuno-y-Merienda':'Almacen',
            # 'Golosinas-y-Chocolates':'Almacen',
            # 'harinas':'Almacen',
            # 'panificados':'Almacen',
            # 'Para-Preparar':'Almacen',
            # 'pastas-secas-y-salsas':'Almacen',
            # 'Sal-Pimienta-y-Especias':'Almacen',
            # 'snacks':'Almacen',
            # 'caldos-sopas-pure-y-bolsas-para-horno':'Almacen',
            },
        'url_template_departamento': 'https://www.vea.com.ar/{}/{}?page={}', 
        'txt_template': 'VEA/Txt/vea_{}.txt',
        'busqueda_por_departamento': True,
        'vtex':True,
    },

    'ATOMO': {
        'departamentos': {
            # '81-bebidas':'Bebidas',
            # '88-mascotas':'Mascotas',
            # '82-mundo-bebe':'MundoBebe',
            # '226-lacteos-y-fiambres':'Lacteos-y-fiambres',
            # '300-carnes-y-congelados':'Carnes-y-congelados',
            '3-almacen':'Almacen',
            # '85-limpieza':'Limpieza',
            # '83-perfumeria':'Perfumeria',
            },
        'url_template_departamento': 'https://atomoconviene.com/atomo-ecommerce/{}?page={}', 
        'txt_template': 'ATOMO/Txt/atomo_{}.txt',
        'busqueda_por_departamento': False,
        'vtex':False,
    },
}



if __name__ == "__main__":

    scrapping = Scrap()

    # Crear la base de datos
    Data_base.crear_base_de_datos()
    
    # Procesar cada tienda configurada
    for tienda, params in config.items():
        scrapping.procesar(
            tienda,
            params['departamentos'],
            params.get('url_template_departamento', ''),
            params['txt_template'],
            params['busqueda_por_departamento'],
            params['vtex'],
        )
        # Enviar reporte de errores por correo
        Mail_sender.reporte_errores_mail(tienda)
