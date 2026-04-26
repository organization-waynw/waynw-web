import { BottomNavBar } from "../components/PersonaCreateStep2/Bottomnavbar";
import { LoadingScreen } from "../components/PersonaCreateStep2/Loadingscreen";
import { QuestionGrid } from "../components/PersonaCreateStep2/Questiongrid";
import { useQuizStep } from "../hooks/PersonaCreateStep2/usequizstep";


function PersonaCreateStep2() {
  const {
    currentStep,
    answers,
    editingCustom,
    customInputValue,
    isLoading,
    question,
    totalSteps,
    progress,
    selectedOptionIndex,
    canProceed,
    setCustomInputValue,
    handleSelectOption,
    handleCustomTextSave,
    handleCustomKeyDown,
    handleNext,
    handlePrev,
  } = useQuizStep();

  if (isLoading) return <LoadingScreen answers={structuredClone(answers)} />;

  return (
    <div className="min-h-screen bg-[#ECF0F9] flex flex-col">
      <main className="flex flex-col items-center flex-1 px-6 py-8">
        {/* 질문 */}
        <h1 className="text-2xl font-bold text-[#0F1C46] text-center max-w-2xl leading-snug">
          {question.question}
        </h1>

        {/* 카드 그리드 */}
        <div className="flex-1 w-full max-w-5xl mt-8">
          <QuestionGrid
            question={question}
            selectedOptionIndex={selectedOptionIndex}
            editingCustom={editingCustom}
            customInputValue={customInputValue}
            answers={answers}
            onSelectOption={handleSelectOption}
            onCustomInputChange={setCustomInputValue}
            onCustomKeyDown={handleCustomKeyDown}
            onCustomSave={handleCustomTextSave}
          />
        </div>
      </main>

      {/* 하단 바 */}
      <BottomNavBar
        currentStep={currentStep}
        totalSteps={totalSteps}
        progress={progress}
        canProceed={canProceed}
        answers={answers}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}

export default PersonaCreateStep2;
