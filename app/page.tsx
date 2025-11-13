import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import PresentationSection from "@/components/presentation-section"
import CatalogSection from "@/components/catalog-section"
import BusinessSchemeSection from "@/components/business-scheme-section"
import CurrencyCalculatorSection from "@/components/currency-calculator-section"
import FAQSection from "@/components/faq-section"
import Header from "@/components/header"
import MarketplaceBanner from "@/components/MarketplaceBanner"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <MarketplaceBanner />
      <AboutSection />
      <CatalogSection />
      <PresentationSection />
      <BusinessSchemeSection />
      <CurrencyCalculatorSection />
      <FAQSection />
    </main>
  )
}
