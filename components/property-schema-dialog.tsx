import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PropertySchemaDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" aria-label="Info" className="flex items-center space-x-2 p-0">
          <Info className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">Schema Info</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl p-6 rounded-lg shadow-lg border-gray-500">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Property Schema Information</DialogTitle>
          <DialogDescription>
            Detailed information on the data schema for the property CSV file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm mt-4">
          <SchemaField 
            title="meta" 
            type="JSON Object" 
            description="Contains metadata about the property, such as price, address, area, and more."
            example={`{
                "price": 85500000,
                "address": "Near Gurgaon-Faridabad Expressway...",
                "areaUnit": "4750 Sq. Ft.",
                ".....": "......."
                }`}
            required={true}

          />
          <Separator />
          <SchemaField 
            title="ratings" 
            type="JSON Object" 
            description="Ratings for various categories like amenities, green area, management, etc."
            example={`{
            "amenities": "4.4 out of 5",
            "green area": "4.5 out of 5",
            ".....": "......."
            }`}
            required={true}
          />
          <Separator />
          <SchemaField 
            title="features" 
            type="Array" 
            description="List of features available in the property."
            example={`["Modular Kitchen", "Chimney", "........."]`}
            required={true}
          />
          <Separator />
          <SchemaField 
            title="link" 
            type="String" 
            description="URL link to the property details page, if available."
            example="https://example.com"
            required={false}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

type SchemaFieldProps = {
  title: string;
  type: string;
  description: string;
  example: string;
  required: boolean
};

const SchemaField: React.FC<SchemaFieldProps> = ({ title, type, description, example, required }) => (
  <div>
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <h3 className="text-md font-semibold">{title}</h3>
        <p className="text-muted-foreground">{required ? "(required)" : '(optional)'}</p>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-md border">{type}</span>
    </div>
    <p className="mt-1">{description}</p>
    <div className="mt-2 p-2 rounded-md font-mono text-xs whitespace-pre-line">
      {example}
    </div>
  </div>
);

export default PropertySchemaDialog;
