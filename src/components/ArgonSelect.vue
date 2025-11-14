<script setup>
const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  size: {
    type: String,
    default: "default",
  },
  success: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "Sélectionner...",
  },
  options: {
    type: Array,
    default: () => [],
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  valueKey: {
    type: String,
    default: "value",
  },
  labelKey: {
    type: String,
    default: "label",
  },
});

const getSize = () => {
  return props.size === "lg" ? "form-control-lg" : props.size === "sm" ? "form-control-sm" : "";
};

const hasIcon = () => {
  return props.success || props.error;
};
</script>

<template>
  <div class="form-group">
    <select
      :id="id"
      :name="name"
      :value="modelValue"
      @change="emit('update:modelValue', $event.target.value)"
      :required="isRequired"
      :disabled="disabled"
      class="form-control"
      :class="[
        getSize(),
        { 'is-valid': success },
        { 'is-invalid': error },
      ]"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option[valueKey]"
        :value="option[valueKey]"
      >
        {{ option[labelKey] }}
      </option>
    </select>
    <div v-if="hasIcon()" class="valid-feedback" :class="{ 'd-block': success }">
      Looks good!
    </div>
    <div v-if="hasIcon()" class="invalid-feedback" :class="{ 'd-block': error }">
      Please provide a valid value.
    </div>
  </div>
</template>

<style scoped>
.form-control {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #d2d6da;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  color: #495057;
  background-color: #fff;
  border-color: #5e72e4;
  outline: 0;
  box-shadow: 0 0 0 2px rgba(94, 114, 228, 0.1);
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 0.6;
  cursor: not-allowed;
}

.form-control-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.form-control-lg {
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.is-valid {
  border-color: #2dce89;
}

.is-invalid {
  border-color: #f5365c;
}
</style>

