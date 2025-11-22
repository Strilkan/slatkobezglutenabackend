# Recipe Content Type Documentation

## Overview

The Recipe content type is designed to store gluten-free recipe information for the "Slatko Bez Glutena" (Sweets Without Gluten) application.

## Fields

### Required Fields

- **title** (string, max 255 characters)
  - The name of the recipe
  - Used to generate the slug automatically

- **description** (text)
  - A brief description of the recipe
  - Can include what makes this recipe special

- **ingredients** (rich text)
  - List of ingredients needed for the recipe
  - Supports rich text formatting for better presentation

- **instructions** (rich text)
  - Step-by-step cooking instructions
  - Supports rich text formatting for numbered lists and formatting

### Optional Fields

- **preparationTime** (integer, min: 0)
  - Time in minutes required to prepare ingredients
  - Helps users plan their cooking

- **cookingTime** (integer, min: 0)
  - Time in minutes required to cook the recipe
  - Does not include preparation time

- **servings** (integer, min: 1, default: 1)
  - Number of servings the recipe makes

- **difficulty** (enumeration)
  - Options: "easy", "medium", "hard"
  - Default: "medium"
  - Helps users choose recipes matching their skill level

- **category** (enumeration)
  - Options: "dessert", "cake", "cookies", "bread", "pastry", "other"
  - Default: "dessert"
  - Used for categorizing and filtering recipes

- **images** (media, multiple)
  - Upload multiple images of the recipe
  - Only image files are allowed
  - Helps users visualize the final product

- **featured** (boolean, default: false)
  - Flag to mark recipes as featured on the homepage
  - Can be used for highlighting special or popular recipes

- **slug** (UID)
  - Automatically generated from the title
  - Creates SEO-friendly URLs
  - Example: "chocolate-cake" from "Chocolate Cake"

## Features

- **Draft & Publish**: Enabled - allows you to save drafts before publishing
- **Internationalization**: Not configured (can be added if needed)
- **Auto-generated timestamps**: Created at and updated at timestamps are automatically managed

## Example Recipe Data

```json
{
  "data": {
    "title": "Gluten-Free Chocolate Cake",
    "description": "A rich and moist chocolate cake that's completely gluten-free",
    "ingredients": "- 200g gluten-free flour\n- 50g cocoa powder\n- 200g sugar\n- 3 eggs\n- 100ml milk\n- 100ml oil",
    "instructions": "1. Preheat oven to 180°C\n2. Mix dry ingredients\n3. Add wet ingredients\n4. Pour into pan and bake for 30 minutes",
    "preparationTime": 15,
    "cookingTime": 30,
    "servings": 8,
    "difficulty": "easy",
    "category": "cake",
    "featured": true
  }
}
```

## API Usage

### Get all recipes
```
GET /api/recipes
```

### Get a single recipe
```
GET /api/recipes/:id
```

### Create a recipe (requires authentication)
```
POST /api/recipes
Content-Type: application/json

{
  "data": {
    "title": "Recipe Title",
    "description": "Recipe description",
    "ingredients": "List of ingredients",
    "instructions": "Cooking instructions",
    ...
  }
}
```

### Update a recipe (requires authentication)
```
PUT /api/recipes/:id
Content-Type: application/json

{
  "data": {
    "title": "Updated Title",
    ...
  }
}
```

### Delete a recipe (requires authentication)
```
DELETE /api/recipes/:id
```

## Query Parameters

Strapi supports various query parameters for filtering, sorting, and pagination:

- `filters[field][$eq]=value` - Filter by exact match
- `filters[field][$contains]=value` - Filter by partial match
- `sort=field:asc` or `sort=field:desc` - Sort results
- `pagination[page]=1&pagination[pageSize]=10` - Pagination
- `populate=*` - Include related data (like images)

Example:
```
GET /api/recipes?filters[category][$eq]=cake&sort=createdAt:desc&populate=*
```

This will get all cake recipes, sorted by newest first, with images included.
