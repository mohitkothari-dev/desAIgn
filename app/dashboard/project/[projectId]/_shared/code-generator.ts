export const generateReactCode = (designIntent: any, screenId?: string) => {
  if (!designIntent) return '// No design intent provided';

  const screen = screenId 
    ? designIntent.screens.find((s: any) => s.id === screenId)
    : designIntent.screens[0];

  if (!screen) return '// Screen not found';

  const componentName = screen.name.replace(/\s+/g, '') || 'GeneratedScreen';

  // Helper to serialize styles
  const serializeStyles = (styles: any) => {
    if (!styles) return '';
    return `style={{ ${Object.entries(styles).map(([k, v]) => `${k}: '${v}'`).join(', ')} }}`;
  };

  // Helper to generate props string
  const generateProps = (props: any) => {
    return Object.entries(props)
      .filter(([k]) => k !== 'children' && k !== 'type' && k !== 'styles' && k !== 'layoutConfig' && k !== 'gridConfig')
      .map(([k, v]) => {
          if (typeof v === 'string') return `${k}="${v}"`;
          return `${k}={${JSON.stringify(v)}}`;
      })
      .join(' ');
  };

  // Recursive component generation
  const renderComponent = (comp: any, indent = 4): string => {
    const spaces = ' '.repeat(indent);
    const { type, content, children, ...rest } = comp;
    
    // Semantic Patterns
    if (type === 'Navbar') {
        return `${spaces}<div className="flex items-center justify-between px-6 py-4 border-b bg-card">\n` +
               `${spaces}  <div className="flex items-center gap-2"><span className="font-bold text-xl">${comp.branding?.text || 'Brand'}</span></div>\n` +
               `${spaces}  <div className="flex gap-6">\n` +
               (comp.links || []).map((l: any) => `${spaces}    <a href="#" className="text-sm font-medium hover:text-primary">${l.label}</a>`).join('\n') + '\n' +
               `${spaces}  </div>\n` +
               `${spaces}  <div className="flex gap-2">\n` +
               (comp.actions || []).map((a: any) => `${spaces}    <Button variant="${a.variant || 'default'}">${a.label}</Button>`).join('\n') + '\n' +
               `${spaces}  </div>\n` +
               `${spaces}</div>`;
    }

    if (type === 'Hero') {
        return `${spaces}<div className="py-20 px-8 flex flex-col items-center text-center bg-gradient-to-b from-background to-muted/20">\n` +
               `${spaces}  <Badge variant="secondary" className="mb-4">New</Badge>\n` +
               `${spaces}  <h1 className="text-5xl font-extrabold tracking-tight mb-6">${comp.headline}</h1>\n` +
               `${spaces}  <p className="text-xl text-muted-foreground max-w-2xl mb-8">${comp.subheadline}</p>\n` +
               `${spaces}  <div className="flex gap-4">\n` +
               (comp.cta || []).map((c: any) => `${spaces}    <Button size="lg" variant="${c.variant || 'default'}">${c.label}</Button>`).join('\n') + '\n' +
               `${spaces}  </div>\n` +
               `${spaces}</div>`;
    }

    if (type === 'Features') {
        return `${spaces}<div className="py-20 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">\n` +
               (comp.items || []).map((item: any) => 
               `${spaces}  <Card>\n` +
               `${spaces}    <CardHeader>\n` +
               `${spaces}       <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center mb-2"><LucideIcon name="${item.icon || 'star'}" /></div>\n` +
               `${spaces}       <CardTitle>${item.title}</CardTitle>\n` +
               `${spaces}    </CardHeader>\n` +
               `${spaces}    <CardContent><p className="text-muted-foreground">${item.description}</p></CardContent>\n` +
               `${spaces}  </Card>`).join('\n') + '\n' +
               `${spaces}</div>`;
    }

    if (type === 'CallToAction') {
        return `${spaces}<div className="py-20 px-6 bg-primary/5 border-y border-primary/10 text-center">\n` +
               `${spaces}  <div className="max-w-4xl mx-auto space-y-8">\n` +
               `${spaces}    <h2 className="text-4xl font-bold tracking-tight">${comp.title}</h2>\n` +
               `${spaces}    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">${comp.description}</p>\n` +
               `${spaces}    <div className="flex justify-center gap-4">\n` +
               (comp.actions || []).map((a: any) => `${spaces}      <Button size="lg" variant="${a.variant || 'default'}">${a.label}</Button>`).join('\n') + '\n' +
               `${spaces}    </div>\n` +
               `${spaces}  </div>\n` +
               `${spaces}</div>`;
    }

    if (type === 'Footer') {
        return `${spaces}<footer className="py-12 px-6 bg-muted/30 border-t">\n` +
               `${spaces}  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">\n` +
               `${spaces}    <div className="space-y-4">\n` +
               `${spaces}      <div className="flex items-center gap-2"><span className="font-bold text-xl">${comp.branding?.text}</span></div>\n` +
               `${spaces}      <p className="text-sm text-muted-foreground">${comp.branding?.description}</p>\n` +
               `${spaces}    </div>\n` +
               (comp.columns || []).map((col: any) => 
               `${spaces}    <div className="space-y-4">\n` +
               `${spaces}      <h4 className="font-semibold">${col.title}</h4>\n` +
               `${spaces}      <div className="flex flex-col gap-2">\n` +
               (col.links || []).map((l: any) => `${spaces}        <a href="#" className="text-sm text-muted-foreground hover:text-primary">${l.label}</a>`).join('\n') + '\n' +
               `${spaces}      </div>\n` +
               `${spaces}    </div>`).join('\n') + '\n' +
               `${spaces}  </div>\n` +
               `${spaces}  <Separator className="my-8" />\n` +
               `${spaces}  <div className="flex justify-between items-center text-sm text-muted-foreground">\n` +
               `${spaces}    <p>${comp.copyright}</p>\n` +
               `${spaces}    <div className="flex gap-4">\n` +
               (comp.social || []).map((s: any) => `${spaces}      <LucideIcon name="${s.icon}" />`).join('\n') + '\n' +
               `${spaces}    </div>\n` +
               `${spaces}  </div>\n` +
               `${spaces}</footer>`;
    }

    // Atomic Components
    if (type === 'Button') {
        return `${spaces}<Button ${generateProps(rest)} variant="${comp.variant || 'default'}">${content || 'Click'}</Button>`;
    }
    if (type === 'Input') {
        return `${spaces}<Input ${generateProps(rest)} placeholder="${comp.placeholder || ''}" />`;
    }
    if (type === 'Card' || (type === 'Container' && (comp.styles?.shadow || comp.styles?.borderWidth))) {
        return `${spaces}<Card ${serializeStyles(comp.styles)} className="overflow-hidden">\n` +
               `${spaces}  <CardContent className="p-0">\n` +
               (children || []).map((c: any) => renderComponent(c, indent + 2)).join('\n') + '\n' +
               `${spaces}  </CardContent>\n` +
               `${spaces}</Card>`;
    }
    if (type === 'Badge') {
        return `${spaces}<Badge variant="${comp.variant || 'secondary'}">${content}</Badge>`;
    }
    if (type === 'Image') {
        return `${spaces}<img src="${comp.src}" alt="${comp.alt}" className="w-full h-auto rounded-lg" />`;
    }
    if (type === 'Text') {
        if (comp.variant === 'h1') return `${spaces}<h1 className="text-4xl font-bold">${content}</h1>`;
        if (comp.variant === 'h2') return `${spaces}<h2 className="text-2xl font-semibold">${content}</h2>`;
        if (comp.variant === 'caption') return `${spaces}<span className="text-sm text-muted-foreground">${content}</span>`;
        return `${spaces}<p className="text-base">${content}</p>`;
    }

    // Default Container
    const childrenCode = children ? children.map((c: any) => renderComponent(c, indent + 2)).join('\n') : '';
    return `${spaces}<div ${serializeStyles(comp.styles)} className="flex flex-col gap-4">\n${childrenCode}\n${spaces}</div>`;
  };

  return `import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as LucideIcons from "lucide-react";

export default function ${componentName}() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground font-sans">
${Array.isArray(screen.children) ? screen.children.map((c: any) => renderComponent(c, 6)).join('\n') : 
'      <div className="flex flex-col items-center justify-center min-h-screen p-8">\n' +
'        <div className="text-2xl font-bold text-gray-600">Screen content will appear here</div>\n' +
'      </div>'}
    </div>
  );
}
`;
};
