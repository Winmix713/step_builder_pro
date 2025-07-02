import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import Step1ConfigurationManagement from "pages/step-1-configuration-management";
import Step2SvgGenerationAndEditor from "pages/step-2-svg-generation-and-editor";
import Step3CssImplementationTools from "pages/step-3-css-implementation-tools";
import Step4FinalCodeGeneration from "pages/step-4-final-code-generation";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<Step1ConfigurationManagement />} />
        <Route path="/step-1-configuration-management" element={<Step1ConfigurationManagement />} />
        <Route path="/step-2-svg-generation-and-editor" element={<Step2SvgGenerationAndEditor />} />
        <Route path="/step-3-css-implementation-tools" element={<Step3CssImplementationTools />} />
        <Route path="/step-4-final-code-generation" element={<Step4FinalCodeGeneration />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;