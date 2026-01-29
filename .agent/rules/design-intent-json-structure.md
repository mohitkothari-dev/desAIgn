---
trigger: manual
---

Instead of storing raw HTML/CSS code, the most powerful alternative is to store a **structured design definition**. Your canvas would render this definition visually, and code generation becomes a separate, final export process.

For your `ScreenConfig` table, you could replace the `code: text("code")` field with something like:

```javascript
designIntent: json("designIntent"), // Stores the JSON structure
```

Here's what a `designIntent` JSON object for a simple hero section could look like:

```json
{
  "type": "Screen",
  "id": "home_hero",
  "layout": "vertical",
  "children": [
    {
      "type": "Container",
      "id": "hero_container",
      "layout": "vertical",
      "styles": {
        "backgroundColor": "#1a1a1a",
        "padding": "80px 24px",
        "textAlign": "center"
      },
      "children": [
        {
          "type": "Text",
          "id": "headline",
          "content": "Welcome to Vibe Designer",
          "styles": {
            "fontSize": "48px",
            "fontWeight": "700",
            "color": "#ffffff"
          }
        },
        {
          "type": "Text",
          "id": "subheadline",
          "content": "Design first. Code later.",
          "styles": {
            "fontSize": "20px",
            "color": "#cccccc",
            "marginTop": "16px"
          }
        }
      ]
    }
  ]
}
```

### 🔧 Why This Approach is Powerful for "Vibe Designer"
*   **True Design/Code Separation**: AI works on this abstract structure. Your canvas renders it. Your final "Generate Code" button runs a **transpiler** that converts this JSON into clean, framework-specific code (React, Vue, HTML/CSS).
*   **User-Friendly Editing**: Users could potentially tweak values (like `fontSize` or `color`) through simple UI controls, which update the JSON and re-render the canvas—all without touching code.
*   **Vibe-Powered AI**: Your "vibe" could be a set of design tokens (color palette, typography scale, spacing rules). The AI applies these tokens to the JSON structure, instantly changing the entire screen's visual theme.

This architecture makes your vision of focusing on the design first completely achievable. 