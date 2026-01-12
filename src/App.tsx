import { BrowserRouter, Route, Routes } from "react-router"
import { SplitCalculatorPage, NotFoundPage } from "@/pages"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SplitCalculatorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
