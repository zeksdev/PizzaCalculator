import { useEffect, useState } from 'react';
import { TabBar } from './components/TabBar';
import { CalculatorScreen } from './screens/CalculatorScreen';
import { QuantitiesScreen } from './screens/QuantitiesScreen';
import { RecipeScreen } from './screens/RecipeScreen';
import { useCalculator } from './useCalculator';

type Route = 'calculator' | 'quantities' | 'recipe';

const ROUTES: Record<string, Route> = {
  '#/kolicine': 'quantities',
  '#/recept': 'recipe',
};

const routeFromHash = (): Route => ROUTES[window.location.hash] ?? 'calculator';

function useRoute(): Route {
  const [route, setRoute] = useState(routeFromHash);
  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return route;
}

export default function App() {
  const route = useRoute();
  const calculator = useCalculator();

  return (
    <div className="app">
      {route === 'calculator' && (
        <CalculatorScreen calculator={calculator} onCalculate={() => (window.location.hash = '#/kolicine')} />
      )}
      {route === 'quantities' && <QuantitiesScreen inputs={calculator.inputs} />}
      {route === 'recipe' && <RecipeScreen />}
      <TabBar active={route === 'recipe' ? 'recipe' : 'calculator'} />
    </div>
  );
}
