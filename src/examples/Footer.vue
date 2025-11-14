<script setup>
import { useStore } from "vuex";
const store = useStore();
</script>
<template>
  <footer class="py-3 footer">
    <div class="container-fluid">
      <div class="row align-items-center justify-content-lg-between">
        <div class="mb-4 col-lg-6 mb-lg-0">
          <div
            class="text-sm text-center copyright text-muted"
            :class="store.state.isRTL ? 'text-lg-end' : 'text-lg-start'"
          >
            ©
            {{ new Date().getFullYear() }} <strong>Lejecolia</strong> - Gestion privative du restaurant
            développée avec <i class="fa fa-heart text-primary"></i> par
            <a
              href="https://kansaconsulting.com"
              class="font-weight-bold text-primary"
              target="_blank"
              >Kansa Business</a
            >
          </div>
        </div>
        <div class="col-lg-6">
          <ul
            class="nav nav-footer justify-content-center justify-content-lg-end"
          >
            <li class="nav-item">
              <a
                href="https://kansaconsulting.com"
                class="nav-link text-muted"
                target="_blank"
                >Kansa Business</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://kansaconsulting.com/#about"
                class="nav-link text-muted"
                target="_blank"
                >À Propos</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://kansaconsulting.com/#services"
                class="nav-link text-muted"
                target="_blank"
                >Services</a
              >
            </li>
            <li class="nav-item">
              <a
                href="https://kansaconsulting.com/#contact"
                class="nav-link pe-0 text-muted"
                target="_blank"
                >Contact</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
