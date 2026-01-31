import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ComponentProps {
  type: string;
  variant?: string;
  content?: string;
  iconName?: string;
  label?: string;
  placeholder?: string;
  src?: string; // For Images
  alt?: string;
  styles?: any;
  layoutConfig?: any;
  gridConfig?: any;
  children?: ComponentProps[];
}

const LucideIcon = ({ name, size = 16, className = "" }: { name: string, size?: number, className?: string }) => {
  const iconName = name.replace('lucide:', '').split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
  return <Icon size={size} className={className} />;
};

// --- Semantic Patterns ---

const NavbarPattern = ({ styles, branding, links, actions }: any) => {
    return (
        <div 
            style={{ 
                ...styles, 
                backgroundColor: styles?.backgroundColor || 'var(--card)',
                borderBottom: '1px solid var(--border)' 
            }} 
            className="flex items-center justify-between px-6 py-4 w-full"
        >
            <div className="flex items-center gap-2">
                {branding?.icon && <LucideIcon name={branding.icon} size={24} className="text-primary" />}
                <span className="text-xl font-bold tracking-tight">{branding?.text || 'Brand'}</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
                {links?.map((link: any, idx: number) => (
                    <a key={idx} href="#" className="text-sm font-medium hover:text-primary transition-colors">
                        {link.label}
                    </a>
                ))}
            </div>

            <div className="flex items-center gap-3">
                {actions?.map((action: any, idx: number) => (
                    <Button key={idx} variant={action.variant || "default"} size="sm">
                        {action.label}
                    </Button>
                ))}
            </div>
        </div>
    )
}

const HeroPattern = ({ styles, headline, subheadline, cta, image }: any) => {
    return (
        <div style={styles} className="flex flex-col md:flex-row items-center gap-12 px-8 py-20 w-full bg-gradient-to-b from-background to-muted/20">
             <div className="flex-1 space-y-6 text-center md:text-left">
                <Badge variant="secondary" className="mb-2">New Features</Badge>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl">
                    {headline}
                </h1>
                <p className="text-xl text-muted-foreground md:w-3/4">
                    {subheadline}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                    {cta?.map((btn: any, idx: number) => (
                        <Button key={idx} size="lg" variant={btn.variant || "default"} className="gap-2">
                             {btn.icon && <LucideIcon name={btn.icon} />}
                             {btn.label}
                        </Button>
                    ))}
                </div>
             </div>
             
             {image && (
                 <div className="flex-1 w-full max-w-xl">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-border/50">
                        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                        <img 
                            src={image.src || "/placeholder.svg"} 
                            alt="Hero" 
                            className="w-full h-auto object-cover" 
                        />
                    </div>
                 </div>
             )}
        </div>
    )
}

const FeaturesGridPattern = ({ styles, title, subtitle, items }: any) => {
    return (
        <div style={styles} className="py-20 px-6 w-full bg-background">
            <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{title}</h2>
                <p className="text-lg text-muted-foreground">{subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {items?.map((item: any, idx: number) => (
                    <Card key={idx} className="bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg border-muted">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                {item.icon && <LucideIcon name={item.icon} size={24} />}
                            </div>
                            <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

const CallToActionPattern = ({ styles, title, description, actions }: any) => {
    return (
        <div style={styles} className="py-20 px-6 w-full bg-primary/5 border-y border-primary/10">
             <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {actions?.map((action: any, idx: number) => (
                        <Button key={idx} size="lg" variant={action.variant || "default"} className="min-w-[150px]">
                            {action.label}
                        </Button>
                    ))}
                </div>
             </div>
        </div>
    )
}

const FooterPattern = ({ styles, branding, columns, copyright, social }: any) => {
    return (
        <div style={styles} className="py-12 px-6 w-full bg-muted/30 border-t border-border">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                <div className="space-y-4">
                     <div className="flex items-center gap-2 mb-4">
                        {branding?.icon && <LucideIcon name={branding.icon} size={24} className="text-primary" />}
                        <span className="text-xl font-bold">{branding?.text}</span>
                     </div>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        {branding?.description}
                     </p>
                </div>
                
                {columns?.map((col: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                        <h4 className="font-semibold">{col.title}</h4>
                        <div className="flex flex-col gap-2">
                            {col.links?.map((link: any, lIdx: number) => (
                                <a key={lIdx} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            
            <Separator className="my-8" />
            
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <p>{copyright}</p>
                <div className="flex gap-4">
                    {social?.map((s: any, idx: number) => (
                        <a key={idx} href="#" className="hover:text-primary transition-colors">
                            <LucideIcon name={s.icon} size={20} />
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

const VisualComponent = ({ component }: { component: ComponentProps }) => {
  const { type, variant, content, iconName, label, placeholder, src, alt, styles, layoutConfig, gridConfig, children } = component;

  // Flatten and normalize styles
  const combinedStyles: React.CSSProperties = {
    ...styles,
    ...(layoutConfig?.display === 'flex' ? {
        display: 'flex',
        flexDirection: layoutConfig.flexDirection || 'row',
        gap: layoutConfig.gap || '8px',
        alignItems: layoutConfig.alignItems || 'stretch',
        justifyContent: layoutConfig.justifyContent || 'flex-start',
    } : {}),
    ...(gridConfig?.display === 'grid' ? {
        display: 'grid',
        gridTemplateColumns: gridConfig.templateColumns || '1fr 1fr',
        gap: gridConfig.gap || '16px'
    } : {})
  };

  switch (type) {
    case 'Container':
      return (
        <div style={combinedStyles}>
          {children?.map((child, idx) => (
            <VisualComponent key={idx} component={child} />
          ))}
        </div>
      );
    case 'Text':
        if (variant === 'h1') return <h1 style={{fontSize: '2rem', fontWeight: 700, ...combinedStyles}}>{content}</h1>;
        if (variant === 'h2') return <h2 style={{fontSize: '1.5rem', fontWeight: 600, ...combinedStyles}}>{content}</h2>;
        if (variant === 'caption') return <span style={{fontSize: '0.875rem', opacity: 0.8, ...combinedStyles}}>{content}</span>;
        return <p style={combinedStyles}>{content}</p>;
    
    case 'Button':
      return (
        <button 
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            border: 'none',
            outline: 'none',
            ...combinedStyles
          }}
        >
          {iconName && <LucideIcon name={iconName} />}
          {content}
        </button>
      );
    
    case 'Input':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: combinedStyles.flex }}>
          {label && <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>{label}</label>}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
             {iconName && <div style={{position: 'absolute', left: '10px'}}><LucideIcon name={iconName} /></div>}
             <input 
                type={variant || 'text'} 
                placeholder={placeholder} 
                style={{
                width: '100%',
                padding: '8px 12px',
                paddingLeft: iconName ? '35px' : '12px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                ...combinedStyles,
                flex: undefined // Prevent double-flexing
                }}
            />
          </div>
        </div>
      );

    case 'Image':
        return (
            <img 
                src={src || '/placeholder.svg'} 
                alt={alt || ''} 
                style={{
                    maxWidth: '100%',
                    objectFit: 'cover',
                    ...combinedStyles
                }} 
            />
        );

    case 'Navbar':
        return <NavbarPattern {...component} />;
    
    case 'Hero':
        return <HeroPattern {...component} />;

    case 'Features':
        return <FeaturesGridPattern {...component} />;

    case 'CallToAction':
        return <CallToActionPattern {...component} />;

    case 'Footer':
        return <FooterPattern {...component} />;

    default:
      return null;
  }
};

const ScreenRenderer = ({ designIntent, screenId }: { designIntent: any, screenId?: string }) => {
  if (!designIntent) return null;

  const screen = screenId 
    ? designIntent.screens.find((s: any) => s.id === screenId)
    : designIntent.screens[0];

  if (!screen) return <div className="p-4 text-red-500">Screen not found</div>;

  const ds = designIntent.designSystem || {};
  const cssVars: any = {
    '--primary-main': ds.colorPalette?.primary?.main,
    '--secondary-main': ds.colorPalette?.secondary?.main,
    '--bg-default': ds.colorPalette?.background?.default,
    '--bg-paper': ds.colorPalette?.background?.paper,
    '--text-primary': ds.colorPalette?.text?.primary,
    '--text-secondary': ds.colorPalette?.text?.secondary,
  };

  return (
    <div 
      className="screen-renderer-root w-full h-full overflow-y-auto" 
      style={{
        ...cssVars,
        backgroundColor: screen.styles?.backgroundColor || 'var(--bg-default)',
        fontFamily: ds.typography?.fontFamily,
        padding: screen.styles?.paddingTop || '0px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {screen.children?.map((child: ComponentProps, idx: number) => (
        <VisualComponent key={idx} component={child} />
      ))}
    </div>
  );
};

export default ScreenRenderer;
