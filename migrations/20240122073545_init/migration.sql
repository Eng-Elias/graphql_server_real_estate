-- CreateTable
CREATE TABLE "Owner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contactNumber" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Property" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "facilities" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "mainImage" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);


DO $$DECLARE
  property_data json;
BEGIN
  property_data := '[ /* ... */ ]'::json;

  FOR property_record IN SELECT * FROM json_array_elements(property_data)
  LOOP
    INSERT INTO "Owner" ("contactNumber", "profileImage", "name", "city")
    VALUES (
      property_record->'owner'->>'contactNumber',
      property_record->'owner'->>'profileImage',
      property_record->'owner'->>'name',
      property_record->'owner'->>'city'
    ) RETURNING id INTO property_record->'owner'->>'id';

    INSERT INTO "Property" ("name", "description", "area", "facilities", "propertyType", "mainImage", "images", "price", "ownerId")
    VALUES (
      property_record->>'name',
      property_record->>'description',
      property_record->>'area',
      property_record->>'facilities',
      property_record->>'propertyType',
      property_record->>'mainImage',
      property_record->>'images',
      (property_record->>'price')::integer,
      (property_record->'owner'->>'id')::integer
    );
  END LOOP;
END$$;
