import { Answer } from "@/app/typings/answer";
import { Question } from "@/app/typings/question";
import React, {
  useRef,
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

export const { 
  QuizUpdateContextProvider,
  useQuizUpdateContext
} = createFastContext({
  answersArr: [] as Answer[],
  questionsArr: [] as Question[],
  dirtyQuestions: [] as Question[],
  deletedQuestions: [] as string[],
  dirtyAnswers: [] as string[],
  deletedAnswers: [] as string[],
});

export default function createFastContext<FastContext>(initialState: FastContext) {
  function useFastContextData(): {
    get: () => FastContext;
    set: (value: Partial<FastContext>) => void;
    subscribe: (callback: () => void) => () => void;
  } {
    const store = useRef(initialState);

    const get = useCallback(() => store.current, []);

    const subscribers = useRef(new Set<() => void>());

    const set = useCallback((value: Partial<FastContext>) => {
      store.current = { ...store.current, ...value };
      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = useCallback((callback: () => void) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  }

  type UseFastContextDataReturnType = ReturnType<typeof useFastContextData>;

  const FastContext = createContext<UseFastContextDataReturnType | null>(null);

  function QuizUpdateContextProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <FastContext.Provider value={useFastContextData()}>
        {children}
      </FastContext.Provider>
    );
  }

  function useFastContext<SelectorOutput>(
    selector: (store: FastContext) => SelectorOutput
  ): [SelectorOutput, (value: Partial<FastContext>) => void] {
    const fastContext = useContext(FastContext);
    if (!fastContext) {
      throw new Error("Store not found");
    }

    const state = useSyncExternalStore(
      fastContext.subscribe,
      () => selector(fastContext.get()),
      () => selector(initialState),
    );

    return [state, fastContext.set];
  }

  function useQuizUpdateContext<SelectorOutput>(
    fieldNames: string[]
  ): { [key: string]: { get: SelectorOutput, set: (value: unknown) => void } } {
    const gettersAndSetters: { [key: string]: { get: SelectorOutput, set: (value: unknown) => void } } = {};
    for (const fieldName of fieldNames) {
      const [getter, setter] = useFastContext((fc) => (fc as Record<string, SelectorOutput>)[fieldName]);
      gettersAndSetters[fieldName] = { get: getter, set: (value: unknown) => setter({ [fieldName]: value } as Partial<FastContext>) };
    }
    
    return gettersAndSetters;
  }

  return {
    QuizUpdateContextProvider,
    useQuizUpdateContext,
  };
}