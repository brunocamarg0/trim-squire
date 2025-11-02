import { Scissors } from "lucide-react";

interface BarberLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export const BarberLogo = ({ size = "md", showText = true }: BarberLogoProps) => {
  const sizeClasses = {
    sm: "h-16 w-4",
    md: "h-24 w-6",
    lg: "h-32 w-8",
  };

  const textSizeClasses = {
    sm: "text-2xl md:text-3xl",
    md: "text-3xl md:text-4xl",
    lg: "text-4xl md:text-5xl",
  };

  const iconSizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Poste de Barbearia */}
      <div className="flex items-center gap-2 mb-2">
        {/* Faixa Vermelha */}
        <div className={`${sizeClasses[size]} bg-[#DC2626] rounded-full shadow-lg relative`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 rounded-full"></div>
        </div>
        
        {/* Faixa Branca */}
        <div className={`${sizeClasses[size]} bg-white rounded-full shadow-lg relative border-2 border-primary/20`}>
          <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100 rounded-full"></div>
        </div>
        
        {/* Faixa Azul */}
        <div className={`${sizeClasses[size]} bg-[#2563EB] rounded-full shadow-lg relative`}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 rounded-full"></div>
        </div>
      </div>

      {/* Ícone de Tesoura e Texto */}
      {showText && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <Scissors className={`${iconSizeClasses[size]} text-primary animate-pulse`} strokeWidth={2.5} />
            <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-primary bg-clip-text text-transparent`}>
              Barber
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};

