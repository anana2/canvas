<template lang=pug>
div(id='app')
    p {{ greeting }} World!
</template>

<script lang=coffee>
export default {
    data() {
        return {
            greeting: 'hello'
        }
    }
}
</script>