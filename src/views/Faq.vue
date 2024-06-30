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
      tatsächlich viele Jahre genutzt habe. Aus zeitlichen Gründen wurde das Projekt jedoch lange
      nicht gepflegt und weiterentwickelt, bis zu dem Punkt an dem ein Upgrade auf eine neuere
      Angular Version quasi unmöglich war.
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
      "BillBird" sollte es heißen und für die Umsetzung entschied ich mich für Vue 3 mit Tailwind
      CSS.
    </p>

    <h2>Was ist für die Zukunft geplant?</h2>
    <p>
      Vermutlich werde ich zukünftig Firebase für die Datenbank. Vielleicht stelle ich eines Tages
      auf Typescript um, baue einen Kalender, Login- und Benutzerbereich und verwende Vuetify.
      Derzeit ist noch alles offen.
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
