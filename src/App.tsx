import { useEffect, useState } from 'react';
import { TabBar } from './components/TabBar';
import { CalculatorScreen } from './screens/CalculatorScreen';
import { QuantitiesScreen } from './screens/QuantitiesScreen';
import { RecipeScreen } from './screens/RecipeScreen';
import { ROUTES, type Route } from './routes';
import { useCalculator } from './useCalculator';

const routeFromHash = (): Route =>
  (Object.keys(ROUTES) as Route[]).find((route) => ROUTES[route] === window.location.hash) ?? 'calculator';

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
        <CalculatorScreen calculator={calculator} onCalculate={() => (window.location.hash = ROUTES.quantities)} />
      )}
      {route === 'quantities' && <QuantitiesScreen inputs={calculator.inputs} />}
      {route === 'recipe' && <RecipeScreen />}
      <TabBar active={route === 'recipe' ? 'recipe' : 'calculator'} />
    </div>
  );
}
