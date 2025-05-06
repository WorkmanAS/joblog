// /lib/utils.ts

// Function to generate a URL-safe slug from any text
export function generateSlug(text: string) {
    return text
      .toLowerCase()
      .replace(/,/g, '')           // Remove commas
      .replace(/\s+/g, '-')         // Replace spaces with dashes
      .replace(/[^\w\-]+/g, '')     // Remove all non-word characters
      .replace(/\-\-+/g, '-')       // Replace multiple dashes with single dash
      .replace(/^-+/, '')           // Trim dashes from start
      .replace(/-+$/, '');          // Trim dashes from end
  }
  