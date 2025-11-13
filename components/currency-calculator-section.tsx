"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowDownUp, Calculator } from "lucide-react"

function MiniChart({ data, positive }: { data: number[], positive: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = range === 0 ? 50 : ((max - value) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="80" height="30" className="flex-shrink-0">
      <polyline
        fill="none"
        stroke={positive ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        points={points}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const currencies = [
  { code: "USD", name: "Доллар США", flag: "🇺🇸", rate: 83.0127, change: "+0.3 ₽ (0.36 %)", positive: true, chartData: [82.5, 82.8, 82.3, 82.9, 83.1, 82.7, 83.0] },
  { code: "CNY", name: "Китайский юань", flag: "🇨🇳", rate: 11.8967, change: "+0.17 ₽ (1.43 %)", positive: true, chartData: [11.6, 11.7, 11.8, 11.75, 11.85, 11.9, 11.89] },
  { code: "USDT", name: "Tether", flag: "₮", rate: 84.2288, change: "+0.13 ₽ (0.15 %)", positive: true, chartData: [84.0, 84.1, 84.15, 84.2, 84.18, 84.22, 84.23] },
  { code: "AED", name: "Дирхам ОАЭ", flag: "🇦🇪", rate: 22.4491, change: "+0.31 ₽ (1.38 %)", positive: true, chartData: [22.1, 22.2, 22.3, 22.25, 22.4, 22.42, 22.45] },
]

export default function CurrencyCalculatorSection() {
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("RUB")
  const [amount, setAmount] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    amount: "",
    fromCurrencyForm: "USD",
    toCurrencyForm: "RUB",
    message: "",
  })

  const amountNum = Number.parseFloat(amount) || 0
  const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1
  const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1

  // Конвертация через RUB как базовую валюту
  const convertedAmount = (amountNum * fromRate) / toRate

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form data:", formData)
    // Здесь будет логика отправки формы
    setIsModalOpen(false)
    setFormData({ name: "", contact: "", amount: "", fromCurrencyForm: "USD", toCurrencyForm: "RUB", message: "" })
  }

  // Открытие модалки с автозаполнением текущих данных калькулятора
  const openModalWithData = () => {
    setFormData({
      ...formData,
      amount: amount,
      fromCurrencyForm: fromCurrency,
      toCurrencyForm: toCurrency,
    })
    setIsModalOpen(true)
  }

  return (
    <section id="calculator" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Калькулятор валют</h2>
          <p className="text-lg text-muted-foreground">Актуальные курсы валют для расчёта стоимости закупок</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Left side - Exchange rates */}
          <Card className="bg-white border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Валютный курс</h3>
              <span className="text-sm text-muted-foreground">00:09</span>
            </div>

            <div className="space-y-3">
              {currencies.map((currency) => (
                <div
                  key={currency.code}
                  className="bg-gray-50 rounded-lg p-5 flex items-center justify-between hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{currency.flag}</span>
                    <div>
                      <div className="font-bold text-lg text-gray-900">{currency.code}</div>
                      <div className="text-sm text-gray-600">{currency.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-gray-900">{currency.rate}</div>
                    <div className={`text-sm font-medium ${currency.positive ? "text-green-600" : "text-red-600"}`}>
                      {currency.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-xs text-muted-foreground mt-4">* по московскому времени</div>

            {/* Информационный блок */}
            <div className="mt-6 space-y-3">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100 h-[72px]">
                <div className="flex items-center gap-3 h-full">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💱</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base leading-tight mb-1 text-gray-900">Без скрытых комиссий</h4>
                    <p className="text-sm text-gray-600 leading-tight">Прозрачные условия обмена валют</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100 h-[72px]">
                <div className="flex items-center gap-3 h-full">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🔔</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base leading-tight mb-1 text-gray-900">Уведомления о курсе</h4>
                    <p className="text-sm text-gray-600 leading-tight">Получайте алерты при выгодном курсе</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100 h-[72px]">
                <div className="flex items-center gap-3 h-full">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base leading-tight mb-1 text-gray-900">Быстрый обмен 24/7</h4>
                    <p className="text-sm text-gray-600 leading-tight">Оперативные сделки в любое время</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right side - Converter */}
          <Card className="bg-white border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-6">Конвертер валют</h3>

            <div className="space-y-4">
              {/* Компактная секция выбора валют */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Из валюты</label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="bg-white border-2 border-gray-300 h-14 text-lg font-semibold w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code} className="text-base">
                          {curr.flag} {curr.code} - {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center py-1">
                  <button
                    onClick={swapCurrencies}
                    className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full p-3 hover:scale-110 transition-transform active:scale-95 cursor-pointer shadow-lg hover:shadow-xl"
                    title="Поменять местами"
                  >
                    <ArrowDownUp className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">В валюту</label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="bg-white border-2 border-gray-300 h-14 text-lg font-semibold w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code} className="text-base">
                          {curr.flag} {curr.code} - {curr.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Поле ввода суммы */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Введите сумму в {fromCurrency}</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Например: 1000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-white border-2 border-gray-300 hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xl pr-16 h-16 transition-all font-semibold"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">
                    {fromCurrency === "USD" ? "$" : fromCurrency === "EUR" ? "€" : fromCurrency}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">Введите любое число для конвертации</p>
              </div>

              {/* Результат конвертации */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border-2 border-purple-200">
                <div className="text-sm font-medium text-purple-700 mb-1">Результат:</div>
                <div className="text-3xl font-bold text-purple-900">{convertedAmount.toFixed(2)} {toCurrency}</div>
                <div className="text-xs text-purple-600 mt-1">Курс: 1 {fromCurrency} = {(fromRate / toRate).toFixed(4)} {toCurrency}</div>
              </div>

              {/* Кнопки */}
              <div className="space-y-3">
                <Button
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:opacity-90 transition-opacity text-white border-0"
                  size="lg"
                >
                  Зафиксировать курс
                </Button>

                <div>
                  <Button
                    onClick={openModalWithData}
                    variant="outline"
                    className="w-full h-12 text-base font-semibold border-2 border-purple-500 text-purple-700 hover:bg-purple-50 transition-colors"
                    size="lg"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Рассчитать точную сумму
                  </Button>
                  <p className="text-center text-xs text-gray-500 mt-1.5">
                    Оставьте заявку и мы рассчитаем это за вас
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Модальное окно с формой */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Рассчитать точную сумму</DialogTitle>
            <DialogDescription className="text-base">
              Оставьте заявку, и наш менеджер свяжется с вами для точного расчета
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Ваше имя *
              </Label>
              <Input
                id="name"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm font-semibold">
                Email или телефон *
              </Label>
              <Input
                id="contact"
                placeholder="+7 (999) 123-45-67 или email@example.com"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="amountForm" className="text-sm font-semibold">
                  Сумма *
                </Label>
                <Input
                  id="amountForm"
                  type="number"
                  placeholder="1000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fromCurrencySelect" className="text-sm font-semibold">
                  Из валюты *
                </Label>
                <Select
                  value={formData.fromCurrencyForm}
                  onValueChange={(value) => setFormData({ ...formData, fromCurrencyForm: value })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toCurrencySelect" className="text-sm font-semibold">
                В валюту *
              </Label>
              <Select
                value={formData.toCurrencyForm}
                onValueChange={(value) => setFormData({ ...formData, toCurrencyForm: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.flag} {curr.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold">
                Дополнительная информация
              </Label>
              <Textarea
                id="message"
                placeholder="Укажите дополнительные детали или вопросы..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-11"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="flex-1 h-11 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:opacity-90 text-white"
              >
                Отправить заявку
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
