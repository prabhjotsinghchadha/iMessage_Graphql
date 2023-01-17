import { Skeleton } from "@chakra-ui/react";

interface SkeletonLoaderProps {
  count: number;
  height: string;
  width: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count,
  height,
  width,
}) => {
  return (
    <>
      <Skeleton />
    </>
  )
}

export default SkeletonLoader;
