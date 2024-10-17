import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Skeleton = ({ className, ...props }) => {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} {...props} />;
};

const LoadingSkeleton = () => {
  return (
    <div className="container mx-auto p-6">
      <Skeleton className="h-10 w-64 mb-6" /> {/* Title skeleton */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <Skeleton className="h-6 w-40" /> {/* Card title skeleton */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" /> {/* Label skeleton */}
                    <Skeleton className="h-8 w-32" /> {/* Input/button skeleton */}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Skeleton className="h-10 w-full" /> {/* Advanced Settings button skeleton */}
      </div>
    </div>
  );
};

export default LoadingSkeleton;