import { BrowserRouter, Route, Routes } from "react-router"
import { NotFoundPage, SplitCalculatorPage } from "@/pages"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplitCalculatorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
