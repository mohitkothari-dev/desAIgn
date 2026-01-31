# Architecture Flow:

1. User inputs → "Make it more vibrant"
2. AI processes → Updates ```designIntent``` JSON (changes color values, etc.)
3. State updates → React re-renders components visually

---
The current approach is significantly more <span style="color: #00F260">**token-efficient**</span> and architecturally robust than asking the AI to generate raw React/HTML code.

Here is why this "Design Intent" approach saves tokens and improves your app:

1. **Data Density (Conciseness):**
Generating a structured JSON like ```{"type": "Button", "content": "Save"}``` is much "**cheaper**" in terms of tokens than generating a full React component:

2. **No Boilerplate:** Avoided repeating ```import...```, ```export default function...```, ```return (...)```, and complex JSX syntax for every single screen.

3. **Property Mapping:** AI only needs to output the values for styles and layout, while ```ScreenRenderer```
 handles the logic of how to apply them.

4. **Predictability & Consistency:** AI often hallucinates or makes syntax errors when generating long blocks of code. By forcing it to output a strict JSON schema:
    - **Lower Error Rate:** The AI is much better at maintaining a valid JSON structure than it is at writing bug-free TypeScript for 5 different screens at once.
    - **Tokens Saved on Retries:** You spend fewer tokens because you don't have to keep re-prompting the AI to *<span style="color: #CB356B">"fix the syntax error"</span>* it made in the generated code.

5. **Client-Side Flexibility (The Big Win)** Because we have the Design Intent (the "recipe") rather than the finished the code (the "dish"):
    - **Instant Theme Swapping:** The app changes the primary color of every screen instantly on the client side just by updating the CSS variables in the renderer. Users don't need to ask the AI to re-generate the code just to change a hex value.
    - **Component Upgrades:** If developer of this app decide tomorrow to use Shadcn UI buttons instead of standard HTML buttons, they only change the code in one place (the ```ScreenRenderer```). If they had generated raw code, they would have to re-generate every single screen to update the components.
6. **Interactive Tokens:** The AI can effectively "summarize" a complex layout in JSON. For example, a 12-column grid system is just a few keys in JSON ```(gridConfig: { templateColumns: "repeat(12, 1fr)" }),```whereas the equivalent CSS and JSX boilerplate would be many more characters.

**Summary:** This app essentially sending the "Blueprint" (tokens used for data) and letting the local CPU do the "Construction" (rendering), which is the standard professional way to build AI-driven design tools.

---
The ```code-generator.ts``` is a deterministic <mark style="background-color: #11998e; color: white; box-shadow: 2px 2px 5px rgba(255, 255, 255, 0.4);">**client-side**</mark> utility, not an LLM call. It costs <span style="color: #00F260">**zero tokens**</span> to click that button because it simply transforms the JSON that already exists into a string format. That mwans
the current "Code Export" feature uses ZERO tokens.

Here is how it works under the hood:

1. **(AI / Costly):** user type a prompt. The LLM generates the designIntent JSON. (Tokens used here).
2. **(Renderer / Free):** The ```ScreenRenderer``` reads that JSON and displays the UI.
3. **(Export / Free):** When user click the button, the 
```code-generator.ts``` script simply takes that existing JSON and mathematically converts it into a string.
    - It loops through the JSON type: "Hero" -> converts it to text ```<div className='hero'>...```.
    - This happens 100% in the browser (Client Side).
    - No API call is made. No data is sent to OpenAI/Gemini. It is instant and free.