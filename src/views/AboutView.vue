<template>
  <div class="about">
    <h1 class="heading">This is an about page</h1>
    <img src="/images/vuejs.jpg" alt="vuejs" />
  </div>
</template>

<style>
.heading {
  margin-bottom: 40px;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
