export type Route = 'calculator' | 'quantities' | 'recipe';

/** Hash routes, so screen changes are plain links and work under the GitHub Pages base path. */
export const ROUTES: Record<Route, string> = {
  calculator: '#/',
  quantities: '#/kolicine',
  recipe: '#/recept',
};
