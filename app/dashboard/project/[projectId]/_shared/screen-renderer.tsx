import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

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

const NavbarPattern = ({ styles, branding, links, actions, variant = "solid" }: any) => {
    const isFloating = variant === "floating";
    
    return (
        <div 
            style={{ 
                ...styles, 
                backgroundColor: isFloating ? 'rgba(255, 255, 255, 0.8)' : (styles?.backgroundColor || 'var(--card)'),
                backdropFilter: isFloating ? 'blur(12px)' : 'none',
                position: isFloating ? 'sticky' : 'relative',
                top: isFloating ? 0 : 'auto',
                zIndex: 50,
                borderBottom: isFloating ? '1px solid rgba(0,0,0,0.1)' : '1px solid var(--border)',
                boxShadow: isFloating ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none',
                width: '100%'
            }} 
            className="flex items-center justify-between px-6 py-4 transition-all duration-300"
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

const HeroPattern = ({ styles, headline, subheadline, cta, image, variant = "default" }: any) => {
    if (variant === "centered") {
        return (
            <div style={styles} className="flex flex-col items-center text-center gap-8 px-8 py-24 w-full bg-gradient-to-b from-background to-muted/20">
                 <div className="max-w-4xl space-y-6">
                    <Badge variant="secondary" className="mb-2 mx-auto w-fit">New Features</Badge>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                        {headline}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        {cta?.map((btn: any, idx: number) => (
                            <Button key={idx} size="lg" variant={btn.variant || "default"} className="gap-2">
                                 {btn.icon && <LucideIcon name={btn.icon} />}
                                 {btn.label}
                            </Button>
                        ))}
                    </div>
                 </div>
                 
                 {image && (
                     <div className="w-full max-w-5xl mt-8">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
                            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
                            <img 
                                src={image.src || "/placeholder.svg"} 
                                alt="Hero" 
                                className="w-full h-auto object-cover max-h-[600px]" 
                            />
                        </div>
                     </div>
                 )}
            </div>
        )
    }

    if (variant === "minimal") {
        return (
             <div style={styles} className="flex flex-col justify-center min-h-[50vh] px-8 py-16 w-full bg-background border-b">
                 <div className="max-w-3xl space-y-4">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground">
                        {headline}
                    </h1>
                    <p className="text-2xl text-muted-foreground border-l-4 border-primary pl-6 py-2">
                        {subheadline}
                    </p>
                    <div className="flex gap-4 pt-6">
                        {cta?.map((btn: any, idx: number) => (
                            <Button key={idx} size="lg" variant={btn.variant || "default"} className="rounded-full px-8">
                                 {btn.label}
                                 {btn.icon && <LucideIcon name={btn.icon} className="ml-2" />}
                            </Button>
                        ))}
                    </div>
                 </div>
            </div>
        )
    }

    // Default Split
    return (
        <div style={styles} className="flex flex-col md:flex-row items-center gap-12 px-8 py-20 w-full bg-background">
             <div className="flex-1 space-y-6 text-center md:text-left">
                <Badge variant="outline" className="mb-2">Highlighted</Badge>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl">
                    {headline}
                </h1>
                <p className="text-xl text-muted-foreground md:w-3/4">
                    {subheadline}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                    {cta?.map((btn: any, idx: number) => (
                        <Button key={idx} size="lg" variant={btn.variant || "default"} className="gap-2 h-12 px-6">
                             {btn.icon && <LucideIcon name={btn.icon} />}
                             {btn.label}
                        </Button>
                    ))}
                </div>
             </div>
             
             {image && (
                 <div className="flex-1 w-full max-w-xl">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/50">
                        <img 
                            src={image.src || "/placeholder.svg"} 
                            alt="Hero" 
                            className="w-full h-auto object-cover aspect-video" 
                        />
                    </div>
                 </div>
             )}
        </div>
    )
}

const FeaturesGridPattern = ({ styles, title, subtitle, items, variant = "grid-3" }: any) => {
    let gridClass = "grid-cols-1 md:grid-cols-3";
    if (variant === "bento") gridClass = "grid-cols-1 md:grid-cols-4 auto-rows-[minmax(200px,auto)]";
    if (variant === "list") gridClass = "grid-cols-1 max-w-3xl";

    return (
        <div style={styles} className="py-20 px-6 w-full bg-background/50">
            <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">{title}</h2>
                <p className="text-lg text-muted-foreground">{subtitle}</p>
            </div>
            
            <div className={`grid ${gridClass} gap-6 max-w-7xl mx-auto`}>
                {items?.map((item: any, idx: number) => {
                    // Bento logic: Make first item span large if bento
                    const isLargeBento = variant === "bento" && (idx === 0 || idx === 3);
                    
                    if (variant === "list") {
                        return (
                            <div key={idx} className="flex gap-6 items-start p-6 rounded-xl hover:bg-muted/50 transition-colors">
                                <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                    {item.icon && <LucideIcon name={item.icon} size={24} />}
                                </div>
                                <div className="space-y-2 text-left">
                                     <h3 className="text-xl font-bold">{item.title}</h3>
                                     <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        )
                    }

                    return (
                        <Card key={idx} className={`bg-card hover:shadow-lg transition-all duration-300 border-muted ${isLargeBento ? 'md:col-span-2 md:row-span-2' : ''}`}>
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
                    )
                })}
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
        <div style={combinedStyles} className={gridConfig?.display === 'grid' ? "grid-container" : "flex-container"}>
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
        <Button 
          variant={(variant as any) || "default"}
          className="gap-2 transition-all duration-200 active:scale-95"
          style={{
            width: styles?.width || 'fit-content',
            ...styles
          }}
        >
          {iconName && <LucideIcon name={iconName} size={16} />}
          {content || label || "Button"}
        </Button>
      );
    
    case 'Input':
      return (
        <div className="flex flex-col gap-2 w-full" style={{ flex: combinedStyles.flex }}>
          {label && <Label className="text-sm font-medium">{label}</Label>}
          <div className="relative flex items-center">
             {iconName && (
                <div className="absolute left-3 text-muted-foreground pointer-events-none">
                    <LucideIcon name={iconName} size={16} />
                </div>
             )}
             <Input 
                type={variant || 'text'} 
                placeholder={placeholder} 
                className={`w-full ${iconName ? 'pl-9' : ''}`}
                style={{
                    ...combinedStyles,
                    flex: undefined
                }}
            />
          </div>
        </div>
      );

    case 'Image':
        // Handle case where AI puts an icon name as an image source
        if (src && src.startsWith('lucide:')) {
             return (
                 <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'var(--muted)',
                    ...combinedStyles
                 }}>
                    <LucideIcon name={src} size={24} />
                 </div>
             );
        }

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
