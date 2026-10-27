<template>
  <header class="topbar">
    <div class="container topbar-inner">
      <RouterLink class="brand" to="/" aria-label="CXRaide home">
        <img class="logo" src="@/assets/LOGO1.png" alt="" />
      </RouterLink>

      <nav class="links" aria-label="Primary">
        <RouterLink :to="{ path: '/', hash: '#overview' }">Overview</RouterLink>
        <RouterLink to="/research">Study</RouterLink>
        <RouterLink to="/metrics">Metrics</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>

      <div class="cta">
        <UiButton variant="ghost" @click="$router.push('/research')">View Study</UiButton>
        <UiButton variant="primary" @click="$router.push('/demo')">Try the Demo</UiButton>
      </div>
    </div>
  </header>
</template>

<script>
import UiButton from "@/ui/UiButton.vue";

export default {
  name: "PublicTopNav",
  components: { UiButton },
};
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

:global(body.theme-light) .topbar {
  background: rgba(255, 255, 255, 0.85);
}

.topbar-inner {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.brand {
  display: flex;
  align-items: center;
  padding: 3px;
  border-radius: 8px;
}

.brand:hover {
  background: rgba(30, 41, 59, 0.35);
}

:global(body.theme-light) .brand:hover {
  background: rgba(15, 23, 42, 0.06);
}

.logo {
  height: 22px;
  width: auto;
  max-width: 220px;
  object-fit: contain;
  display: block;
}

.links {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-2);
}

.links a {
  color: var(--text-2);
  font-weight: 600;
  font-size: 12px;
}

.links a:hover {
  color: var(--primary);
  text-decoration: none;
}

.cta {
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 860px) {
  .links {
    display: none;
  }
}
</style>
