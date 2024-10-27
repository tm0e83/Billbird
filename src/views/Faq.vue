<template>
  <div class="outer-container">
    <h1>FAQ</h1>

    <h2>Was ist BillBird?</h2>
    <p>
      BillBird ist ein privates Projekt zum Verwalten meiner eigenen Finanzen. Es soll mir einen
      besseren Überblick über meine Ersparnisse geben und dabei helfen, monatlich die nötigen
      Beträge für Jahres- oder Quartalsrechnungen zurückzulegen. Neben seinem eigentlichen Nutzen
      soll mir BillBird außerdem als Showcase für Bewerbungen dienen und ist sowas wie meine
      Programmier-Spielwiese, um neue Technologien auszuprobieren.
    </p>

    <h2>Für wen ist BillBird gedacht?</h2>
    <p>
      Da wohl niemand außer außer mir die eigenen Finanzen auf so eigenwillige Art und Weise pflegen
      würde: Nur für mich ;-).
    </p>

    <h2>Wie ist BillBird entstanden?</h2>
    <p>
      2014 hatte ich bereits eine ähnliche Webapp auf Basis von AngularJS realisiert, die ich dann
      tatsächlich viele Jahre genutzt habe. Aus zeitlichen Gründen wurde das Projekt jedoch so lange
      nicht gepflegt und weiterentwickelt, bis der Punkt erreicht war, an dem ein Upgrade auf eine
      neuere Angular Version quasi unmöglich war.
    </p>
    <p>
      Nachdem ich 2016 einen Angular 2 Workshop besucht hatte, wollte ich anschließend eine auf
      Angular 2+ basierende Version der Webapp erstellen und Firebase als Datenbank einsetzen.
      Obwohl ich einige Funktionalitäten bereits umgesetzt hatte, habe ich auch dieses Projekt nicht
      weiter verfolgt. Zu aufwendig, zu wenig Zeit. Man kennt es.
    </p>
    <p>
      Als ich 2022 unerwartet meinen Job verlor und mir klar wurde, dass mir für eine neue
      Arbeitsstelle Erfahrungen in Angular, React oder Vue fehlen, griff ich das Projekt wieder auf.
      &#8222;BillBird&#8220; sollte es heißen und für die Umsetzung entschied ich mich für Vue 3 mit
      Tailwind CSS.
    </p>

    <h2>Was ist inzwischen passiert?</h2>
    <p>
      Inzwischen verwende ich Firebase für den Benutzerlogin und als Datenbank. Tailwind habe ich
      wieder entfernt, weil es mir einfach keinen echten Mehrwert bot. Leider habe ich privat wenig
      Zeit mich mit der Weiterentwicklung von BillBird zu beschäftigen. Das Projekt kommt daher
      immer wieder ins Stocken.
    </p>

    <h2>Was ist für die Zukunft geplant?</h2>
    <p>
      Ich möchte möglist bald vollständig auf Typescript wechseln. Bislang ist Typescript nur an
      sehr wenigen Stellen im Einsatz.
    </p>
    <p>
      Da ich in ETFs und Aktien investiert habe und diese Investitionen über meine App pflege,
      möchte ich zukünftig die aktuellen Börsenkurse für die Berechnung der Vermögenswerte
      verwenden.
    </p>
    <p>
      Es gibt noch viele weitere Pläne. Ob ich die Zeit haben werden sie alle umzusetzen, wird sich
      zeigen.
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables';
@import '@/assets/styles/mixins';

.outer-container {
  max-width: 64rem; /* 1024px */
  margin: 2rem auto 0;
  background-color: #fff;
  border-radius: $global-radius;
  padding: 1.25rem;
}
</style>
