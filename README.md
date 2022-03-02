# EVA-Tool (Admin-Frontend)

## Inhaltsverzeichnis
* [Kurzbeschreibung](#Kurzbeschreibung)
* [Förderhinweis](#Förderhinweis)
* [Architektur](#Architektur)
* [Installation](#Installation)
* [Benutzung](#Benutzung)
* [Credits](#Credits)
* [Lizenz](#Lizenz)

## Kurzbeschreibung
Beschreibungstext einfügen.

## Förderhinweis
Diese Website ist entstanden im Verbundprojekt museum4punkt0 – Digitale Strategien für das Museum der Zukunft, Teilprojekt EVA-Tool. Das Projekt museum4punkt0 wird gefördert durch die Beauftragte der Bundesregierung für Kultur und Medien aufgrund eines Beschlusses des Deutschen Bundestages. Weitere Informationen: www.museum4punkt0.de


## Architektur
![architecture diagram](./doc/architecture.svg)

## Installation

-   yarn install
-   cp .env.local.example .env.local
-   yarn dev

## Benutzung

##Credits

## Lizenz

## routes
/surveys
/surveys/new
/surveys/:surveyId
/surveys/:surveyId/edit
/surveys/:surveyId/results

/survey-steps
/survey-steps/new (?)
/survey-steps/:surveyStepId

/survey-elements
/survey-elements/new
/survey-elements/:surveyElementId

/survey-step-results
/survey-step-results/new (?)
/survey-step-results/:surveyStepResultId
/survey-step-results/:surveyStepResultId/assets (?)

/languages
/languages/new
/languages/:languageId
/languages/:languageId/edit

/localizations
/localizations/new (?)
/localizations/:localizationId

/users/register
/users/login
/users/:userId/logout
/users/:userId/settings (?)