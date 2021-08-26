<template>
    <Container v-if="notifications.length > 0">
        <Item v-for="notification in notifications" :key="notification.id">
            <Message>
                {{ notification.type }}:
                {{ notification.message }}
            </Message>
            <Actions>
                <Button @click="handlers.onRemove(notification)">
                    <font-awesome-icon :icon="['fas', 'times']" />
                </Button>
            </Actions>
        </Item>
    </Container>
</template>

<script>
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import styled from 'vue3-styled-components'
import Button from '../Common/Button'
const { useState, useActions } = createNamespacedHelpers('notifications')

const Container = styled.ul`
    position: absolute;
    bottom: 48px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.9);
    padding: 24px;
    color: white;
    width: 50vw;
`
const Item = styled.li`
    display: flex;
`
const Message = styled.div`
    flex-grow: 1;
`
const Actions = styled.div``

export default {
    components: {
        Container,
        Item,
        Message,
        Actions,
        Button,
    },
    setup(props) {
        const { notifications } = useState(['notifications'])
        const { remove, addWarning } = useActions(['remove', 'addWarning'])

        const onRemove = (notification) => {
            remove({ notification })
        }
        addWarning({ message: 'testmessage' })
        return {
            notifications,
            handlers: {
                onRemove,
            },
        }
    },
}
</script>

<style></style>
