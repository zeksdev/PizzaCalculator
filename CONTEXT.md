# Pizza Dough Calculator

Turns a desired number of pizzas into exact ingredient weights for one dough batch, using baker's percentages, and pairs them with the author's own illustrated dough recipe. The UI is in Serbian (Latin script); each term below lists its Serbian label.

## Language

### Dough

**Batch** (*Testo*):
All the dough mixed in one go, later divided into Dough balls.
_Avoid_: Recipe (when meaning the quantities), mix

**Dough ball** (*Loptica testa*):
One portion of the Batch, shaped and proofed individually; one ball makes one pizza.
_Avoid_: Pizza, portion, serving

**Ball weight** (*Težina loptice*):
Target weight of one Dough ball counting flour, water and salt only — yeast is added on top and excluded.
_Avoid_: Dough weight, portion size

**Baker's percentage** (*Pekarski procenat*):
An ingredient's weight expressed as a percentage of the flour weight; flour is always 100%.
_Avoid_: Ratio, proportion

**Hydration** (*Hidratacija*):
Water as a Baker's percentage.
_Avoid_: Water ratio, moisture

### Yeast

**Yeast type** (*Vrsta kvasca*):
The form of commercial yeast used: Fresh (*Sveži*), Active dry (*Aktivni suvi*) or Instant dry (*Instant suvi*). Types are interchangeable via fixed conversion ratios.
_Avoid_: Leavening, starter (sourdough is out of scope), "dry yeast" without qualifier

**Recommended yeast percentage** (*Preporučeni procenat kvasca*):
The yeast Baker's percentage suggested for a given Proofing schedule and Yeast type; the user may override it until the Proofing schedule or Yeast type changes.
_Avoid_: Default yeast, yeast amount

### Proofing

**Proofing schedule** (*Fermentacija*):
A fixed preset describing how long and at what temperature the dough rests before baking: Same day, Next day, 48h or 72h.
_Avoid_: Proof time, rise

**Cold proof** (*Hladna fermentacija*):
The part of a Proofing schedule spent refrigerated (1–5 °C).
_Avoid_: Cold ferment, retard

**Room proof** (*Fermentacija na sobnoj temperaturi*):
The part of a Proofing schedule spent at room temperature (20–23 °C).
_Avoid_: Warm proof, bulk

### Output

**Quantities** (*Količine*):
The calculated ingredient weights for one Batch, each shown with its Baker's percentage.
_Avoid_: Result, recipe, ingredients list

**Recipe** (*Recept*):
The author's single illustrated step-by-step guide to making the dough; fixed content, independent of the inputs and of the chosen Proofing schedule.
_Avoid_: Method, instructions, guide
