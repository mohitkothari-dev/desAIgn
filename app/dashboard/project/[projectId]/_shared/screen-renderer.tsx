import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

// Merge base classes with optional LLM-supplied tailwindClasses override
const cx = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

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
  /** LLM-injectable Tailwind utility string – merged on top of base classes */
  tailwindClasses?: string;
  children?: ComponentProps[];
  defaultValue?: string;
  tabs?: any[];
  items?: any[];
  headers?: string[];
  rows?: any[][];
  checked?: boolean;
  value?: number;
  header?: any;
  // New interactive component props
  title?: string;
  description?: string;
  fallback?: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  avatars?: any[];
  limit?: number;
  orientation?: 'horizontal' | 'vertical';
  showControls?: boolean;
  [key: string]: any; // Allow indexing
}

const LucideIcon = ({ name, size = 16, className = "" }: { name: string, size?: number, className?: string }) => {
  const iconName = name.replace('lucide:', '').split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;
  return <Icon size={size} className={className} />;
};

// --- Semantic Patterns ---

const NavbarPattern = ({ styles, branding, links, actions, variant = "solid", _manualOverrides }: any) => {
    const containerOverrides = _manualOverrides?.container || {};
    const isFloating = variant === "floating";
    const isTransparent = variant === "transparent";
    const isMinimal = variant === "minimal";
    const isGlassmorphic = variant === "glassmorphic";

    // All navbar variants are sticky — a non-sticky navbar is a UX anti-pattern
    let bgStyle = {};
    let borderStyle = 'border-b';
    let borderColor = 'border-border/60';

    if (isFloating) {
        bgStyle = {
            backgroundColor: 'color-mix(in srgb, var(--card), transparent 20%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 1px 0 color-mix(in srgb, var(--border), transparent 50%)'
        };
        borderStyle = '';
    } else if (isGlassmorphic) {
        bgStyle = {
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--card), transparent 30%) 0%, color-mix(in srgb, var(--card), transparent 50%) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid color-mix(in srgb, var(--border), transparent 70%)'
        };
        borderStyle = '';
    } else if (isTransparent) {
        bgStyle = {
            backgroundColor: 'color-mix(in srgb, var(--background), transparent 30%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
        };
        borderColor = 'border-border/20';
    } else if (isMinimal) {
        bgStyle = {
            backgroundColor: 'color-mix(in srgb, var(--background), transparent 5%)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
        };
        borderColor = 'border-border/30';
    } else {
        // solid (default) — frosted glass so it doesn't look flat
        bgStyle = {
            backgroundColor: 'color-mix(in srgb, var(--card), transparent 8%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
        };
    }

    return (
        <div
            style={{
                ...bgStyle,
                ...styles,
                ...containerOverrides,
                // Always sticky — this is the modern standard for navbars
                position: 'sticky',
                top: 0,
                zIndex: 50,
                width: '100%'
            }}
            className={`flex items-center justify-between px-6 ${isMinimal ? 'py-3' : 'py-4'} transition-all duration-300 ${borderStyle} ${borderColor}`}
        >
            <div className="flex items-center gap-2">
                {branding?.icon && <LucideIcon name={branding.icon} size={22} className="text-primary" />}
                <span className={`${isMinimal ? 'text-lg' : 'text-xl'} font-bold tracking-tight`}>{branding?.text || 'Brand'}</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
                {links?.map((link: any, idx: number) => (
                    <a key={idx} href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                        {link.label}
                    </a>
                ))}
            </div>

            <div className="flex items-center gap-2">
                {actions?.map((action: any, idx: number) => (
                    <Button key={idx} variant={action.variant || "default"} size="sm" className="text-sm px-4">
                        {action.label}
                    </Button>
                ))}
            </div>
        </div>
    );
}

const HeroPattern = ({ styles, headline, subheadline, cta, image, variant = "default", styleIntensity = "standard", effects, badge, _manualOverrides }: any) => {
    // Apply manual overrides if present
    const containerOverrides = _manualOverrides?.container || {};
    const headlineOverrides = _manualOverrides?.headline || {};
    
    // Determine intensity-based styling
    const intensityClasses = {
        minimal: "py-16",
        standard: "py-20",
        premium: "py-24 md:py-32"
    };
    
    const paddingClass = intensityClasses[styleIntensity as keyof typeof intensityClasses] || intensityClasses.standard;
    
    // Gradient Animated Variant
    if (variant === "gradient-animated") {
        return (
            <div
                style={{
                    ...styles,
                    ...containerOverrides,
                    background: effects?.gradient === "sunset"
                        ? "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--accent, #f093fb) 100%)"
                        : "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                    position: "relative",
                    overflow: "hidden"
                }}
                className={`flex flex-col items-center text-center gap-8 px-8 ${paddingClass} w-full relative`}
            >
                {/* Animated background effect */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
                </div>

                <div className="max-w-4xl space-y-6 relative z-10">
                    {badge && (
                        <Badge variant="secondary" className="mb-2 mx-auto w-fit backdrop-blur-sm bg-background/20 text-foreground border-foreground/30">
                            {badge}
                        </Badge>
                    )}
                    <h1
                        style={headlineOverrides}
                        className="text-5xl md:text-7xl font-black tracking-tight text-white drop-shadow-lg leading-[1.05]"
                    >
                        {headline}
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md leading-relaxed">
                        {subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        {cta?.map((btn: any, idx: number) => (
                            <Button
                                key={idx}
                                size="lg"
                                variant={btn.variant || "default"}
                                className="gap-2 h-12 px-8 shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {btn.icon && <LucideIcon name={btn.icon} />}
                                {btn.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {image && (
                    <div className="w-full max-w-5xl mt-8 relative z-10">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-lg">
                            <img
                                src={image.src || "/placeholder.svg"}
                                alt="Hero"
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    // Glassmorphic Variant
    if (variant === "glassmorphic") {
        return (
            <div
                style={{
                    ...styles,
                    ...containerOverrides,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: effects?.blur || "blur(16px)",
                    position: "relative"
                }}
                className={`flex flex-col items-center text-center gap-8 px-8 ${paddingClass} w-full border border-white/20`}
            >
                <div className="max-w-4xl space-y-6">
                    {badge && (
                        <Badge variant="outline" className="mb-2 mx-auto w-fit bg-white/10 backdrop-blur-md border-white/30">
                            {badge}
                        </Badge>
                    )}
                    <h1
                        style={headlineOverrides}
                        className="text-5xl md:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 leading-[1.05]"
                    >
                        {headline}
                    </h1>
                    <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                        {subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        {cta?.map((btn: any, idx: number) => (
                            <Button
                                key={idx}
                                size="lg"
                                variant={btn.variant || "default"}
                                className="gap-2 h-12 px-8 backdrop-blur-sm bg-primary/90 hover:bg-primary shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                            >
                                {btn.icon && <LucideIcon name={btn.icon} />}
                                {btn.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {image && (
                    <div className="w-full max-w-5xl mt-8">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-lg bg-white/5">
                            <img
                                src={image.src || "/placeholder.svg"}
                                alt="Hero"
                                className="w-full h-auto object-cover max-h-[600px]"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    // Split Content Variant (Default-esque but enhanced)
    if (variant === "split-content") {
        return (
            <div 
                style={{ ...styles, ...containerOverrides }} 
                className={`flex flex-col md:flex-row items-center gap-12 px-8 ${paddingClass} w-full bg-background`}
            >
                <div className="flex-1 space-y-6 text-center md:text-left">
                    <Badge variant="outline" className="mb-2">🚀 Highlighted</Badge>
                    <h1 
                        style={headlineOverrides}
                        className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
                    >
                        {headline}
                    </h1>
                    <p className="text-xl text-muted-foreground md:w-3/4 leading-relaxed">
                        {subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                        {cta?.map((btn: any, idx: number) => (
                            <Button 
                                key={idx} 
                                size="lg" 
                                variant={btn.variant || "default"} 
                                className="gap-2 h-12 px-6 shadow-md hover:shadow-lg transition-all"
                            >
                                {btn.icon && <LucideIcon name={btn.icon} />}
                                {btn.label}
                            </Button>
                        ))}
                    </div>
                </div>
                
                {image && (
                    <div className="flex-1 w-full max-w-xl">
                        <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-border/50 hover:shadow-2xl transition-shadow">
                            <img 
                                src={image.src || "/placeholder.svg"} 
                                alt="Hero" 
                                className="w-full h-auto object-cover aspect-video" 
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Centered Variant — Premium, dramatic, production-grade SaaS hero
    if (variant === "centered") {
        return (
            <div
                style={{ ...styles, ...containerOverrides }}
                className={`relative flex flex-col items-center text-center px-8 ${paddingClass} w-full overflow-hidden`}
            >
                {/* Layered glow background — this is the main visual upgrade */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    {/* Base background */}
                    <div className="absolute inset-0 bg-background" />
                    {/* Central large primary glow */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full blur-[120px] opacity-30"
                        style={{ background: 'var(--primary)' }}
                    />
                    {/* Secondary subtle accent */}
                    <div
                        className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full blur-3xl opacity-15"
                        style={{ background: 'var(--secondary)' }}
                    />
                    {/* Noise grain overlay for depth */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'
                    }} />
                </div>

                <div className="max-w-4xl space-y-8 relative z-10">
                    {/* Dynamic badge — only shown if LLM provides one */}
                    {badge && (
                        <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-1.5 text-sm text-muted-foreground mx-auto">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                            {badge}
                        </div>
                    )}
                    <h1
                        style={headlineOverrides}
                        className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-foreground"
                    >
                        {headline}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                        {cta?.map((btn: any, idx: number) => (
                            <Button
                                key={idx}
                                size="lg"
                                variant={btn.variant || "default"}
                                className={cx(
                                    "gap-2 h-12 px-8 text-base font-semibold transition-all duration-200",
                                    (btn.variant === "default" || !btn.variant)
                                        ? "shadow-lg hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5"
                                        : "hover:-translate-y-0.5 hover:shadow-md"
                                )}
                            >
                                {btn.icon && <LucideIcon name={btn.icon} />}
                                {btn.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {image && (
                    <div className="w-full max-w-5xl mt-16 relative z-10">
                        {/* Glow ring behind image */}
                        <div
                            className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 -z-10"
                            style={{ background: 'var(--primary)' }}
                        />
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/40 ring-1 ring-border/20">
                            <img
                                src={image.src || "/placeholder.svg"}
                                alt="Hero"
                                className="w-full h-auto object-cover max-h-[580px]"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Minimal Variant (Enhanced)
    if (variant === "minimal") {
        return (
            <div 
                style={{ ...styles, ...containerOverrides }} 
                className={`flex flex-col justify-center min-h-[50vh] px-8 ${paddingClass} w-full bg-background border-b`}
            >
                <div className="max-w-3xl space-y-4">
                    <h1 
                        style={headlineOverrides}
                        className="text-6xl md:text-8xl font-black tracking-tighter text-foreground"
                    >
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
        );
    }

    // Default Variant — Premium split-layout with gradient mesh background
    return (
        <div
            style={{ ...styles, ...containerOverrides }}
            className={cx(
                `relative flex flex-col md:flex-row items-center gap-12 px-8 ${paddingClass} w-full overflow-hidden`,
                "bg-gradient-to-br from-background via-muted/30 to-background"
            )}
        >
            {/* Decorative gradient mesh */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/8 blur-3xl" />
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left relative z-10">
                {badge && (
                    <Badge variant="outline" className="mb-2 border-primary/30 bg-primary/5 text-primary">
                        {badge}
                    </Badge>
                )}
                <h1
                    style={headlineOverrides}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text"
                >
                    {headline}
                </h1>
                <p className="text-xl text-muted-foreground md:w-3/4 leading-relaxed">
                    {subheadline}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                    {cta?.map((btn: any, idx: number) => (
                        <Button
                            key={idx}
                            size="lg"
                            variant={btn.variant || "default"}
                            className="gap-2 h-12 px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            {btn.icon && <LucideIcon name={btn.icon} />}
                            {btn.label}
                        </Button>
                    ))}
                </div>
            </div>

            {image && (
                <div className="flex-1 w-full max-w-xl relative z-10">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/40 hover:shadow-primary/10 hover:shadow-3xl transition-shadow duration-500">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                        <img
                            src={image.src || "/placeholder.svg"}
                            alt="Hero"
                            className="w-full h-auto object-cover aspect-video"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

const FeaturesGridPattern = ({ styles, title, subtitle, items, variant = "grid-3", styleIntensity = "standard", _manualOverrides }: any) => {
    const containerOverrides = _manualOverrides?.container || {};
    
    // Intensity-based spacing
    const intensityClasses = {
        minimal: "py-12",
        standard: "py-20",
        premium: "py-24 md:py-32"
    };
    const paddingClass = intensityClasses[styleIntensity as keyof typeof intensityClasses] || intensityClasses.standard;
    
    // Bento Modern - Advanced grid with mixed sizes
    if (variant === "bento-modern" || variant === "bento") {
        return (
            <div style={{ ...styles, ...containerOverrides }} className={`${paddingClass} px-6 w-full bg-gradient-to-b from-background to-muted/20`}>
                <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-5xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">{title}</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-fr gap-4 max-w-7xl mx-auto">
                    {items?.map((item: any, idx: number) => {
                        const isLarge = idx === 0 || idx === 3;
                        return (
                            <Card 
                                key={idx} 
                                className={`group bg-gradient-to-br from-card to-muted/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-muted/50 backdrop-blur-sm ${isLarge ? 'md:col-span-2 md:row-span-2' : ''}`}
                            >
                                <CardHeader>
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                                        {item.icon && <LucideIcon name={item.icon} size={isLarge ? 32 : 24} />}
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{item.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {item.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        );
    }
    
    // Card Hover - Enhanced cards with sophisticated hover effects
    if (variant === "card-hover") {
        return (
            <div style={{ ...styles, ...containerOverrides }} className={`${paddingClass} px-6 w-full bg-background`}>
                <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">{title}</h2>
                    <p className="text-lg text-muted-foreground">{subtitle}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {items?.map((item: any, idx: number) => (
                        <Card 
                            key={idx} 
                            className="group relative overflow-hidden bg-card hover:shadow-xl transition-all duration-300 border-muted/50 hover:border-primary/50"
                        >
                            {/* Hover gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <CardHeader className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 text-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                                    {item.icon && <LucideIcon name={item.icon} size={28} />}
                                </div>
                                <CardTitle className="text-2xl mb-3">{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="relative">
                                <p className="text-muted-foreground leading-relaxed">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    
    // List Minimal - Clean, spacious list layout
    if (variant === "list-minimal" || variant === "list") {
        return (
            <div style={{ ...styles, ...containerOverrides }} className={`${paddingClass} px-6 w-full bg-background/50`}>
                <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">{title}</h2>
                    <p className="text-lg text-muted-foreground">{subtitle}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto">
                    {items?.map((item: any, idx: number) => (
                        <div 
                            key={idx} 
                            className="group flex gap-6 items-start p-8 rounded-2xl hover:bg-muted/70 transition-all duration-300 border border-transparent hover:border-border/50"
                        >
                            <div className="w-14 h-14 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                                {item.icon && <LucideIcon name={item.icon} size={26} />}
                            </div>
                            <div className="space-y-2 text-left flex-1">
                                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    // Grid Enhanced — Premium cards with glow-on-hover and gradient icon containers
    let gridClass = "grid-cols-1 md:grid-cols-3";
    if (variant === "grid-2") gridClass = "grid-cols-1 md:grid-cols-2";
    if (variant === "grid-4") gridClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

    return (
        <div style={{ ...styles, ...containerOverrides }} className={`${paddingClass} px-6 w-full bg-gradient-to-b from-background to-muted/10`}>
            <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">{title}</h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">{subtitle}</p>
            </div>

            <div className={`grid ${gridClass} gap-6 max-w-7xl mx-auto`}>
                {items?.map((item: any, idx: number) => (
                    <div
                        key={idx}
                        className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Subtle inner glow on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mb-5 text-primary border border-primary/10 group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                                {item.icon && <LucideIcon name={item.icon} size={22} />}
                            </div>
                            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const CallToActionPattern = ({ styles, title, description, actions, variant = "default", _manualOverrides }: any) => {
    const containerOverrides = _manualOverrides?.container || {};
    
    // Minimal Variant
    if (variant === "minimal") {
        return (
            <div style={{ ...styles, ...containerOverrides }} className="py-16 px-6 w-full border-t border-border/50">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-left space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                        <p className="text-lg text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        {actions?.map((action: any, idx: number) => (
                            <Button key={idx} size="lg" variant={action.variant || "default"} className="min-w-[140px]">
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    // Gradient Variant
    if (variant === "gradient") {
        return (
            <div 
                style={{ 
                    ...styles, 
                    ...containerOverrides,
                    background: "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary), transparent 20%) 100%)"
                }} 
                className="py-24 px-6 w-full relative overflow-hidden"
            >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl" />
                
                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">{title}</h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        {description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        {actions?.map((action: any, idx: number) => (
                            <Button 
                                key={idx} 
                                size="lg" 
                                variant={action.variant === "outline" ? "outline" : "secondary"} 
                                className={`min-w-[150px] ${action.variant === "outline" ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" : "bg-primary-foreground text-primary hover:bg-primary-foreground/90"}`}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    // Split Variant
    if (variant === "split") {
        return (
            <div style={{ ...styles, ...containerOverrides }} className="py-20 px-6 w-full bg-muted/30">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4 text-left">
                        <h2 className="text-4xl font-bold tracking-tight">{title}</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {description}
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        {actions?.map((action: any, idx: number) => (
                            <Button 
                                key={idx} 
                                size="lg" 
                                variant={action.variant || "default"} 
                                className="w-full justify-center h-14 text-lg"
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    // Banner Variant
    if (variant === "banner") {
        return (
            <div style={{ ...styles, ...containerOverrides }} className="py-12 px-6 w-full bg-primary text-primary-foreground">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-left space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                        {description && (
                            <p className="text-base text-primary-foreground/90">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-3 shrink-0">
                        {actions?.map((action: any, idx: number) => (
                            <Button 
                                key={idx} 
                                size="lg" 
                                variant={action.variant === "outline" ? "outline" : "secondary"} 
                                className={action.variant === "outline" ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" : ""}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    // Default Variant — Premium gradient band with decorative glow orbs
    return (
        <div
            style={{ ...styles, ...containerOverrides }}
            className="relative py-24 px-6 w-full overflow-hidden"
        >
            {/* Gradient background band */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/8 via-background to-secondary/8" />
            {/* Decorative orbs */}
            <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-primary/10 blur-3xl -z-10" />
            <div className="pointer-events-none absolute -bottom-32 left-1/4 h-48 w-48 rounded-full bg-secondary/10 blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {actions?.map((action: any, idx: number) => (
                        <Button
                            key={idx}
                            size="lg"
                            variant={action.variant || "default"}
                            className="min-w-[160px] shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

const FooterPattern = ({ styles, branding, columns, copyright, social, variant = "default", _manualOverrides }: any) => {
    const containerOverrides = _manualOverrides?.container || {};
    
    // Minimal Variant
    if (variant === "minimal") {
        return (
            <div style={{ ...styles, ...containerOverrides }} className="py-8 px-6 w-full bg-muted/20 border-t border-border/50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        {branding?.icon && <LucideIcon name={branding.icon} size={20} className="text-primary" />}
                        <span className="font-medium">{branding?.text}</span>
                    </div>
                    <p>{copyright || `© ${new Date().getFullYear()} All rights reserved.`}</p>
                    <div className="flex gap-4">
                        {social?.map((s: any, idx: number) => (
                            <a key={idx} href="#" className="hover:text-primary transition-colors">
                                <LucideIcon name={s.icon} size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    // Newsletter Variant
    if (variant === "newsletter") {
        return (
            <div style={{ ...styles, ...containerOverrides }} className="py-16 px-6 w-full bg-gradient-to-b from-muted/20 to-muted/40 border-t border-border">
                <div className="max-w-7xl mx-auto">
                    {/* Newsletter Section */}
                    <div className="mb-12 text-center max-w-xl mx-auto">
                        <h3 className="text-2xl font-bold mb-3">Stay Updated</h3>
                        <p className="text-muted-foreground mb-6">Subscribe to our newsletter for the latest updates and news.</p>
                        <div className="flex gap-2">
                            <Input placeholder="Enter your email" type="email" className="flex-1" />
                            <Button>Subscribe</Button>
                        </div>
                    </div>
                    
                    <Separator className="my-8" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
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
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                        <p>{copyright || `© ${new Date().getFullYear()} ${branding?.text}. All rights reserved.`}</p>
                        <div className="flex gap-4">
                            {social?.map((s: any, idx: number) => (
                                <a key={idx} href="#" className="hover:text-primary transition-colors">
                                    <LucideIcon name={s.icon} size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Default Variant — Premium footer with dark gradient backdrop
    return (
        <div
            style={{ ...styles, ...containerOverrides }}
            className="py-16 px-6 w-full bg-gradient-to-b from-muted/40 to-muted/20 border-t border-border/50"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        {branding?.icon && <LucideIcon name={branding.icon} size={22} className="text-primary" />}
                        <span className="text-xl font-bold tracking-tight">{branding?.text}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {branding?.description}
                    </p>
                    {/* Social icons next to branding */}
                    {social && social.length > 0 && (
                        <div className="flex gap-3 pt-2">
                            {social.map((s: any, idx: number) => (
                                <a key={idx} href="#"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                                    <LucideIcon name={s.icon} size={16} />
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {columns?.map((col: any, idx: number) => (
                    <div key={idx} className="space-y-4">
                        <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide">{col.title}</h4>
                        <div className="flex flex-col gap-2">
                            {col.links?.map((link: any, lIdx: number) => (
                                <a key={lIdx} href="#"
                                    className="text-sm text-muted-foreground hover:text-primary transition-colors hover:translate-x-0.5 inline-block">
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Separator className="my-6 opacity-50" />

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                <p>{copyright || `© ${new Date().getFullYear()} ${branding?.text || ''}. All rights reserved.`}</p>
            </div>
        </div>
    );
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
      // Calculate grid span classes
      const colSpanClass = component.colSpan === 'full' ? 'col-span-full' : 
                           typeof component.colSpan === 'number' ? `col-span-${component.colSpan}` : '';
      const rowSpanClass = typeof component.rowSpan === 'number' ? `row-span-${component.rowSpan}` : '';
      
      return (
        <div
          style={{
            ...combinedStyles,
            gridColumn: component.colSpan === 'full' ? '1 / -1' : component.colStart ? `${component.colStart} / ${component.colEnd || 'auto'}` : undefined,
            gridRow: component.rowSpan ? `span ${component.rowSpan}` : undefined,
          }}
          className={cx(
            gridConfig?.display === 'grid' ? 'grid-container' : 'flex-container',
            colSpanClass,
            rowSpanClass,
            (component as any).tailwindClasses
          )}
        >
          {children?.map((child, idx) => (
            <VisualComponent key={idx} component={child} />
          ))}
        </div>
      );
    case 'Text':
        if (variant === 'h1') return <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight lg:text-6xl" style={combinedStyles}>{content}</h1>;
        if (variant === 'h2') return <h2 className="text-3xl font-semibold tracking-tight first:mt-0" style={combinedStyles}>{content}</h2>;
        if (variant === 'h3') return <h3 className="text-2xl font-semibold tracking-tight" style={combinedStyles}>{content}</h3>;
        if (variant === 'caption') return <span className="text-sm text-muted-foreground" style={combinedStyles}>{content}</span>;
        if (variant === 'body') return <p className="leading-7 [&:not(:first-child)]:mt-6" style={combinedStyles}>{content}</p>;
        return <p className="leading-7" style={combinedStyles}>{content}</p>;
    
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

    case 'Card':
      return (
        <Card style={combinedStyles} className={cx("overflow-hidden hover:shadow-lg transition-shadow duration-300", (component as any).tailwindClasses)}>
          {(component.header || component.title || component.description) && (
            <CardHeader>
              {component.title && <CardTitle>{component.title}</CardTitle>}
              {component.description && <CardDescription>{component.description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent className={(!component.header && !component.title && !component.description) ? "pt-6" : ""}>
            {content && <p className="text-muted-foreground mb-4">{content}</p>}
            {children?.map((child, idx) => (
              <VisualComponent key={idx} component={child} />
            ))}
          </CardContent>
        </Card>
      );

    // New Interactive Components
    case 'Accordion': {
      const { items, defaultValue } = component;
      const [openItem, setOpenItem] = React.useState(defaultValue || null);
      return (
        <Accordion type="single" collapsible value={openItem || undefined} onValueChange={setOpenItem} className="w-full">
          {items?.map((item: any, idx: number) => (
            <AccordionItem key={idx} value={item.value || `item-${idx}`}>
              <AccordionTrigger>{item.trigger}</AccordionTrigger>
              <AccordionContent>{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );
    }

    case 'Tabs': {
      const { tabs, defaultValue } = component;
      const [activeTab, setActiveTab] = React.useState(defaultValue || tabs?.[0]?.value || 'tab1');
      return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" style={combinedStyles}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {tabs?.map((tab: any, idx: number) => (
              <TabsTrigger key={idx} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {tabs?.map((tab: any, idx: number) => (
            <TabsContent key={idx} value={tab.value}>
              {Array.isArray(tab.content) 
                ? tab.content.map((child: any, cidx: number) => <VisualComponent key={cidx} component={child} />)
                : <div className="p-4">{tab.content}</div>
              }
            </TabsContent>
          ))}
        </Tabs>
      );
    }

    case 'Switch': {
      const { label, checked: defaultChecked } = component;
      const [isChecked, setIsChecked] = React.useState(defaultChecked || false);
      return (
        <div className="flex items-center space-x-2" style={combinedStyles}>
          <Switch id={`switch-${Math.random().toString(36).substr(2, 9)}`} checked={isChecked} onCheckedChange={setIsChecked} />
          {label && <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</Label>}
        </div>
      );
    }

    case 'Table': {
      const { headers, rows } = component;
      return (
        <div className="w-full overflow-auto" style={combinedStyles}>
          <Table>
            <TableHeader>
              <TableRow>
                {headers?.map((header: string, idx: number) => (
                  <TableHead key={idx}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows?.map((row: any[], ridx: number) => (
                <TableRow key={ridx}>
                  {row.map((cell: any, cidx: number) => (
                    <TableCell key={cidx}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
    }

    case 'Alert': {
      const { variant, title, description } = component;
      return (
        <Alert variant={(variant as "default" | "destructive" | null | undefined) || 'default'} style={combinedStyles}>
          <AlertTitle>{title}</AlertTitle>
          {description && <AlertDescription>{description}</AlertDescription>}
        </Alert>
      );
    }

    case 'Progress': {
      const { value, label } = component;
      return (
        <div className="w-full space-y-2" style={combinedStyles}>
          {label && <div className="flex justify-between text-sm"><span>{label}</span><span>{value}%</span></div>}
          <Progress value={value || 0} className="w-full" />
        </div>
      );
    }

    case 'Avatar': {
      const { src, fallback, size } = component;
      const sizeClasses = { sm: 'h-8 w-8', default: 'h-10 w-10', lg: 'h-12 w-12', xl: 'h-16 w-16' };
      return (
        <Avatar className={`${sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.default}`} style={combinedStyles}>
          {src && <AvatarImage src={src} />}
          <AvatarFallback>{fallback || '?'}</AvatarFallback>
        </Avatar>
      );
    }

    case 'AvatarGroup': {
      const { avatars, limit } = component;
      const displayAvatars = avatars?.slice(0, limit || 3) || [];
      const remaining = (avatars?.length || 0) - (limit || 3);
      return (
        <div className="flex -space-x-2 overflow-hidden" style={combinedStyles}>
          {displayAvatars.map((avatar: any, idx: number) => (
            <Avatar key={idx} className="inline-block h-8 w-8 rounded-full ring-2 ring-background">
              {avatar.src && <AvatarImage src={avatar.src} />}
              <AvatarFallback>{avatar.fallback || '?'}</AvatarFallback>
            </Avatar>
          ))}
          {remaining > 0 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-medium">
              +{remaining}
            </div>
          )}
        </div>
      );
    }

    case 'Carousel': {
      const { items, orientation, showControls } = component;
      return (
        <Carousel orientation={orientation || 'horizontal'} opts={{ align: 'start' }} className="w-full" style={combinedStyles}>
          <CarouselContent>
            {items?.map((item: any, idx: number) => (
              <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <VisualComponent component={item} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {showControls !== false && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>
      );
    }

    case 'Badge': {
      const { content, iconName } = component;
      return (
        <Badge variant={(variant as "default" | "destructive" | "outline" | "secondary" | null | undefined) || 'secondary'} className="gap-1" style={combinedStyles}>
          {iconName && <LucideIcon name={iconName} size={14} />}
          {content}
        </Badge>
      );
    }

    case 'Separator': {
      const { orientation } = component;
      return <Separator orientation={orientation || 'horizontal'} style={combinedStyles} />;
    }

    default:
      return null;
  }
};


// It renders whatever components exist in the designIntent.screens[].children array
const ScreenRenderer = ({ designIntent, screenId }: { designIntent: any, screenId?: string }) => {
  if (!designIntent) return null;
  
  // Check if screens array exists and is not empty
  if (!designIntent.screens || !Array.isArray(designIntent.screens) || designIntent.screens.length === 0) {
    return <div className="p-4 text-red-500">No screens available in design intent</div>;
  }

  const screen = screenId 
    ? designIntent.screens.find((s: any) => s.id === screenId)
    : designIntent.screens[0];

  if (!screen) return <div className="p-4 text-red-500">Screen not found</div>;

  const ds = designIntent.designSystem || {};
  
  // Consolidated HEX-only CSS variables with proper fallbacks and AI-intuitive mappings
  const cssVars: any = {
    // Standard variables
    '--primary': ds.colorPalette?.primary?.main || '#0f172a',
    '--primary-foreground': ds.colorPalette?.primary?.light || '#f8fafc',
    '--secondary': ds.colorPalette?.secondary?.main || '#f1f5f9',
    '--secondary-foreground': ds.colorPalette?.secondary?.dark || '#0f172a',
    '--background': ds.colorPalette?.background?.default || '#ffffff',
    '--foreground': ds.colorPalette?.text?.primary || '#0f172a',
    '--card': ds.colorPalette?.background?.paper || '#ffffff',
    '--card-foreground': ds.colorPalette?.text?.primary || '#0f172a',
    '--muted': ds.colorPalette?.background?.elevated || '#f1f5f9',
    '--muted-foreground': ds.colorPalette?.text?.secondary || '#64748b',
    '--border': ds.effects?.borderRadius ? '#e2e8f0' : '#e2e8f0',
    '--radius': ds.effects?.borderRadius?.medium || '0.5rem',

    // AI-Intuitive and semantic mappings
    '--primary-main': ds.colorPalette?.primary?.main || '#0f172a',
    '--secondary-main': ds.colorPalette?.secondary?.main || '#f1f5f9',
    '--bg-default': ds.colorPalette?.background?.default || '#ffffff',
    '--bg-paper': ds.colorPalette?.background?.paper || '#ffffff',
    '--text-primary': ds.colorPalette?.text?.primary || '#0f172a',
    '--text-secondary': ds.colorPalette?.text?.secondary || '#64748b',
  };

  return (
    <div 
      className="screen-renderer-root w-full h-full overflow-y-auto" 
      style={{
        ...cssVars,
        backgroundColor: screen.styles?.backgroundColor || 'var(--background)',
        color: 'var(--foreground)',
        fontFamily: ds.typography?.fontFamily || 'system-ui, sans-serif',
        padding: screen.styles?.paddingTop || '0px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Dynamic rendering - only render components that exist in the design intent */}
      {screen.children?.map((child: ComponentProps, idx: number) => (
        <VisualComponent key={idx} component={child} />
      ))}
    </div>
  );
};

export default ScreenRenderer;
