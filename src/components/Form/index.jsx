import React from 'react';
import {createEffect, createStore, createEvent, sample} from 'effector'
import {useStore, useStoreMap} from 'effector-react'
const sendFormFx = createEffect( {handler:console.log})
const submitted = createEvent()
const setField = createEvent()
const $form = createStore({}).on(setField, ( s, { key, value }) => ({
    ...s,
    [key]: value,
}))
sample({
    source: $form,
    clock: submitted,
    target: sendFormFx
})

const handleChange = setField.prepend(e =>  {
    return ({
        key: e.target.name,
        value: e.target.value,
    });
})


const Field = ({ name, type, label }) => {
    const value = useStoreMap({
        store: $form,
        keys: [name],
        fn: values => values[name] || "",
    })
    return (
        <div>
            {label}{" "}
            <input name={name} type={type} value={value} onChange={handleChange}/>
        </div>
    )
}
const Form = () => {
    return (
        <form action="javascript:void(0)" onSubmit={submitted}>
            <Field name="email" label="Email" type="email"/>
            <Field name="password" label="password" type="password"/>
            <Field name="confirmation" label="confirmation" type="password"/>
            <Field name="contacts" label="contacts" type="text"/>
            <button type="submit">Submit!</button>
            {JSON.stringify(useStore($form))}
        </form>
    )
};
submitted.watch(e => {
    e.preventDefault()
})
export default Form;