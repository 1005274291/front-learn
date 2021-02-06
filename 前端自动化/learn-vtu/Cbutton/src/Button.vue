<template>
  <div>
    <button @click="handleClick"></button>
  </div>
</template>

<script>
export default {
  setup(props, { emit }) {
    const handleClick = () => {
      emit("change", 1);
    };

    return {
      handleClick,
    };
  },
};
</script>

<style lang="scss" scoped></style>
