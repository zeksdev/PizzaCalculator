import { Header } from '../components/Header';
import { strings } from '../strings';

/** Step photos live in public/recept/; replace korak-N.jpg to swap a photo. */
const stepImage = (step: number) => `${import.meta.env.BASE_URL}recept/korak-${step}.jpg`;

export function RecipeScreen() {
  return (
    <>
      <Header title={strings.appName} />
      <main className="screen recipe">
        <div className="recipe__heading">
          <h2 className="recipe__title">{strings.recipeTitle}</h2>
          <span className="recipe__subtitle">{strings.recipeSubtitle}</span>
        </div>
        <ol className="plain-list recipe__steps">
          {strings.recipeSteps.map((text, index) => {
            const step = index + 1;
            return (
              <li key={step} className="recipe-step">
                <img className="recipe-step__image" src={stepImage(step)} alt={strings.recipeStepPhoto(step)} loading="lazy" />
                <div className="recipe-step__body">
                  <span className="recipe-step__number" aria-hidden="true">
                    {step}
                  </span>
                  <p className="recipe-step__text">{text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </>
  );
}
