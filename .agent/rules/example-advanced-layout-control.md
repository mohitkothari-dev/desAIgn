---
trigger: manual
---

Question: Provide me with this:
1. More advanced controls for layout (flexbox, grid editors)?
2. AI prompt templates to reliably manipulate the JSON structure?


### ⚙️ Advanced Layout Controls (Flexbox & Grid Editors)
The key is to manage layout properties in your `designIntent` JSON. Below are examples for Flexbox and CSS Grid controls that a user can interact with.

**1. Extend your JSON Schema for Layout**
Add a `layout` object within a container's `styles`:
```javascript
// Example node in your designIntent JSON
{
  "type": "Container",
  "id": "hero_container",
  "styles": {
    "display": "flex",
    "layout": {
      "flexDirection": "row",
      "justifyContent": "center",
      "alignItems": "stretch",
      "gap": "20px",
      "wrap": true
    }
  },
  "children": [...]
}
```

**2. Create a Visual Layout Control Panel**
This React component lets users tweak the layout values, updating the JSON state.

```javascript
// components/LayoutEditor.jsx
'use client';
import { useDesign } from '@/context/DesignContext';

export default function LayoutEditor() {
  const { selectedNodeId, updateNodeStyles, findNode, design } = useDesign();
  const selectedNode = selectedNodeId ? findNode(design, selectedNodeId) : null;

  // Ensure layout object exists
  const layout = selectedNode?.styles?.layout || {};

  const handleLayoutChange = (property, value) => {
    // Create or update the layout object
    updateNodeStyles(selectedNodeId, {
      layout: { ...layout, [property]: value }
    });
  };

  // Render different controls based on display mode
  const renderFlexboxControls = () => (
    <div className="space-y-4">
      <h4 className="font-bold">Flexbox Layout</h4>
      <div>
        <label className="block text-sm mb-1">Direction</label>
        <select value={layout.flexDirection || 'row'}
                onChange={(e) => handleLayoutChange('flexDirection', e.target.value)}
                className="w-full p-2 border rounded">
          <option value="row">Row</option>
          <option value="column">Column</option>
          <option value="row-reverse">Row Reverse</option>
          <option value="column-reverse">Column Reverse</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Justify Content</label>
        <select value={layout.justifyContent || 'flex-start'}
                onChange={(e) => handleLayoutChange('justifyContent', e.target.value)}>
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="space-between">Space Between</option>
          <option value="space-around">Space Around</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Gap (px)</label>
        <input type="range" min="0" max="100"
               value={parseInt(layout.gap) || 0}
               onChange={(e) => handleLayoutChange('gap', `${e.target.value}px`)} />
        <span>{layout.gap || '0px'}</span>
      </div>
      <div>
        <label className="flex items-center">
          <input type="checkbox"
                 checked={layout.wrap || false}
                 onChange={(e) => handleLayoutChange('wrap', e.target.checked)} />
          <span className="ml-2">Wrap Items</span>
        </label>
      </div>
    </div>
  );

  // Add similar function for Grid controls...
  const renderGridControls = () => (
    <div className="space-y-4">
      <h4 className="font-bold">CSS Grid</h4>
      <div>
        <label className="block text-sm mb-1">Grid Template Columns</label>
        <input type="text" placeholder="1fr 1fr 1fr"
               value={layout.gridTemplateColumns || ''}
               onChange={(e) => handleLayoutChange('gridTemplateColumns', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm mb-1">Gap (row column)</label>
        <input type="text" placeholder="10px 20px"
               value={layout.gap || ''}
               onChange={(e) => handleLayoutChange('gap', e.target.value)} />
      </div>
    </div>
  );

  // Main render
  return (
    <div>
      <h3 className="font-bold mb-4">Layout Editor</h3>
      {!selectedNode ? (
        <p>Select a container to edit layout</p>
      ) : (
        <div>
          {/* Toggle between Flex and Grid */}
          <div className="flex border-b mb-4">
            <button className={`px-4 py-2 ${selectedLayoutMode === 'flex' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setSelectedLayoutMode('flex')}>Flexbox</button>
            <button className={`px-4 py-2 ${selectedLayoutMode === 'grid' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setSelectedLayoutMode('grid')}>CSS Grid</button>
          </div>
          
          {selectedLayoutMode === 'flex' ? renderFlexboxControls() : renderGridControls()}
        </div>
      )}
    </div>
  );
}
```

**3. Integrate into Main Editor**
Add this component to your editing panel. When users adjust these controls, the `designIntent` JSON updates, and your canvas re-renders using the component map from before.

### ✨ AI Prompt Templates for JSON Manipulation
Instead of asking for code, you instruct the AI to manipulate the JSON structure. Using a structured prompt system like the one for AI images  is key. General strategies for structuring these prompts include defining a clear role and task .

**Example 1: Prompt for Theme Change**
```javascript
// System Prompt
You are a UI design assistant that manipulates a designIntent JSON structure.
You will ONLY respond with a valid JSON object that modifies the given design.
Your task is to apply visual changes based on the user's "vibe" description.

// User Prompt with Context
Current designIntent: { /* ... the entire JSON ... */ }
User Vibe: "Make this feel more professional and corporate with a blue theme."

// Expected AI Action
The AI analyzes the JSON, identifies color and typography styles, and returns a patch:
{
  "operation": "update_styles",
  "targets": [
    {
      "nodeId": "hero_container",
      "styles": {
        "backgroundColor": "#0d1b2a"
      }
    },
    {
      "nodeId": "headline",
      "styles": {
        "color": "#1e40af",
        "fontFamily": "Inter, sans-serif",
        "fontWeight": "600"
      }
    }
  ]
}
```

**Example 2: Prompt for Layout Reorganization (Chain-of-Thought)**
Chain-of-thought prompting, which encourages the AI to reason step-by-step, is effective for complex tasks .
```javascript
// User Prompt
Reorganize the hero section to have the text on the left and an image placeholder on the right.
Think step-by-step:
1. Identify the container with id 'hero_container'.
2. Change its layout from a single column to a two-column flex row.
3. Ensure the text element stays on the left.
4. Add a new Image component as the second child.

// AI's Chain-of-Thought (Internal)
"First, I find 'hero_container'. Its current children are one Text node.
I will change its styles.layout.flexDirection to 'row'.
I will add a new child of type 'Image' after the Text node.
I will set appropriate styles for both children."

// AI Response
{
  "operation": "reorganize_layout",
  "target": "hero_container",
  "changes": {
    "styles": {
      "layout": {
        "flexDirection": "row",
        "justifyContent": "space-between"
      }
    },
    "children": [
      { /* existing text child */ },
      {
        "type": "Image",
        "id": "hero_image",
        "styles": { "width": "50%" },
        "props": { "src": "placeholder.svg" }
      }
    ]
  }
}
```

**General-Purpose Instruction Template**
You can adapt this template for different operations:
```javascript
{
  "instruction": "Modify the designIntent JSON to achieve the following: [USER'S VIBE DESCRIPTION]",
  "rules": [
    "Only change style properties and layout structures.",
    "Never invent new node types outside the allowed list: Container, Text, Button, Image, Section.",
    "Preserve the overall hierarchical structure unless explicitly asked to reorganize.",
    "Return only the specific nodes that were changed, using their IDs."
  ],
  "allowed_operations": ["update_styles", "add_child", "remove_child", "reorder_children"]
}
```
