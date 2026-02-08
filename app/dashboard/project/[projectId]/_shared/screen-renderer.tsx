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

const NavbarPattern = ({ styles, branding, links, actions, variant = "solid", _manualOverrides }: any) => {
    const containerOverrides = _manualOverrides?.container || {};
    const isFloating = variant === "floating";
    const isTransparent = variant === "transparent";
    const isMinimal = variant === "minimal";
    const isGlassmorphic = variant === "glassmorphic";
    
    // Determine background based on variant
    let bgStyle = {};
    let borderStyle = 'border-b';
    let borderColor = 'border-border';
    
    if (isFloating) {
        bgStyle = { 
            backgroundColor: 'color-mix(in srgb, var(--card), transparent 20%)', 
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 30px color-mix(in srgb, var(--foreground), transparent 90%)'
        };
        borderColor = 'border-border/50';
    } else if (isGlassmorphic) {
        bgStyle = {
            background: 'linear-gradient(135deg, color-mix(in srgb, var(--card), transparent 30%) 0%, color-mix(in srgb, var(--card), transparent 50%) 100%)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid color-mix(in srgb, var(--border), transparent 70%)'
        };
        borderStyle = '';
    } else if (isTransparent) {
        bgStyle = { backgroundColor: 'transparent' };
        borderColor = 'border-transparent';
    } else if (isMinimal) {
        bgStyle = { backgroundColor: 'var(--background)' };
        borderColor = 'border-border/30';
    } else {
        bgStyle = { backgroundColor: 'var(--card)' };
    }
    
    return (
        <div 
            style={{ 
                ...bgStyle,
                ...styles, 
                ...containerOverrides,
                position: isFloating ? 'sticky' : 'relative',
                top: isFloating ? 0 : 'auto',
                zIndex: 50,
                width: '100%'
            }} 
            className={`flex items-center justify-between px-6 ${isMinimal ? 'py-3' : 'py-4'} transition-all duration-300 ${borderStyle} ${borderColor}`}
        >
            <div className="flex items-center gap-2">
                {branding?.icon && <LucideIcon name={branding.icon} size={24} className="text-primary" />}
                <span className={`${isMinimal ? 'text-lg' : 'text-xl'} font-bold tracking-tight`}>{branding?.text || 'Brand'}</span>
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
    );
}

const HeroPattern = ({ styles, headline, subheadline, cta, image, variant = "default", styleIntensity = "standard", effects, _manualOverrides }: any) => {
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
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                </div>
                
                <div className="max-w-4xl space-y-6 relative z-10">
                    <Badge variant="secondary" className="mb-2 mx-auto w-fit backdrop-blur-sm bg-background/20 text-foreground border-foreground/30">
                        ✨ New Features
                    </Badge>
                    <h1 
                        style={headlineOverrides}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg"
                    >
                        {headline}
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                        {subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        {cta?.map((btn: any, idx: number) => (
                            <Button 
                                key={idx} 
                                size="lg" 
                                variant={btn.variant || "default"} 
                                className="gap-2 shadow-xl"
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
                    <Badge variant="outline" className="mb-2 mx-auto w-fit bg-white/10 backdrop-blur-md border-white/30">
                        New Features
                    </Badge>
                    <h1 
                        style={headlineOverrides}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
                    >
                        {headline}
                    </h1>
                    <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
                        {subheadline}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        {cta?.map((btn: any, idx: number) => (
                            <Button 
                                key={idx} 
                                size="lg" 
                                variant={btn.variant || "default"} 
                                className="gap-2 backdrop-blur-sm bg-primary/90 hover:bg-primary shadow-lg"
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

    // Centered Variant (Enhanced)
    if (variant === "centered") {
        return (
            <div 
                style={{ ...styles, ...containerOverrides }} 
                className={`flex flex-col items-center text-center gap-8 px-8 ${paddingClass} w-full bg-gradient-to-b from-background to-muted/20`}
            >
                <div className="max-w-4xl space-y-6">
                    <Badge variant="secondary" className="mb-2 mx-auto w-fit">New Features</Badge>
                    <h1 
                        style={headlineOverrides}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight"
                    >
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

    // Default Variant (Enhanced)
    return (
        <div 
            style={{ ...styles, ...containerOverrides }} 
            className={`flex flex-col md:flex-row items-center gap-12 px-8 ${paddingClass} w-full bg-background`}
        >
            <div className="flex-1 space-y-6 text-center md:text-left">
                <Badge variant="outline" className="mb-2">Highlighted</Badge>
                <h1 
                    style={headlineOverrides}
                    className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl"
                >
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
    
    // Grid Enhanced (Default with enhancements)
    let gridClass = "grid-cols-1 md:grid-cols-3";
    if (variant === "grid-2") gridClass = "grid-cols-1 md:grid-cols-2";
    if (variant === "grid-4") gridClass = "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";

    return (
        <div style={{ ...styles, ...containerOverrides }} className={`${paddingClass} px-6 w-full bg-background/50`}>
            <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">{title}</h2>
                <p className="text-lg text-muted-foreground">{subtitle}</p>
            </div>
            
            <div className={`grid ${gridClass} gap-6 max-w-7xl mx-auto`}>
                {items?.map((item: any, idx: number) => (
                    <Card key={idx} className="bg-card hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-muted/50">
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
    
    // Default Variant (Enhanced)
    return (
        <div style={{ ...styles, ...containerOverrides }} className="py-20 px-6 w-full bg-primary/5 border-y border-primary/10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    {description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {actions?.map((action: any, idx: number) => (
                        <Button key={idx} size="lg" variant={action.variant || "default"} className="min-w-[150px] shadow-md hover:shadow-lg transition-shadow">
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
    
    // Default Variant (Enhanced)
    return (
        <div style={{ ...styles, ...containerOverrides }} className="py-12 px-6 w-full bg-muted/30 border-t border-border">
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
                <p>{copyright || `© ${new Date().getFullYear()} All rights reserved.`}</p>
                <div className="flex gap-4">
                    {social?.map((s: any, idx: number) => (
                        <a key={idx} href="#" className="hover:text-primary transition-colors">
                            <LucideIcon name={s.icon} size={20} />
                        </a>
                    ))}
                </div>
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
