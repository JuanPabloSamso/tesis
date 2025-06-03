import { Card, CardContent, Skeleton } from '@mui/material';

export default function SkeletonCard() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Skeleton variant="rectangular" height={140} />
        <Skeleton sx={{ my: 1 }} height={28} />
        <Skeleton width="60%" />
        <Skeleton width="40%" />
      </CardContent>
    </Card>
  );
}
