import React from 'react';
import {createEffect, createStore, createEvent, sample} from 'effector'
import {useStore, useStoreMap} from 'effector-react'

const sendFormFx = createEffect({ handler: console.log })
const submitted = createEvent()
const setField = createEvent()
const additionalFields = createEvent()
const removedField = createEvent()
const $form = createStore({ additionalFields: [] }).on(setField, (s, { key, value }) => ({
    ...s,
    [key]: value,
})).on(additionalFields, (s, { key, value }) => ({
    ...s,
    "name": "ewe",
})).on(removedField, (form, idx) => form.filter((_, curIdx) => curIdx !== idx))
sample({
    source: $form,
    clock: submitted,
    target: sendFormFx
})

const handleChange = setField.prepend(e => {
    return ({
        key: e.target.name,
        value: e.target.value,
    });
})

const handleAppendedField = () => {


}

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
    const additionalFields = useStore($form)?.additionalFields;
    console.log("additionalFields", additionalFields);
    return (
        <form action="javascript:void(0)" onSubmit={submitted}>
            <Field name="email" label="Email" type="email"/>
            <Field name="password" label="password" type="password"/>
            <Field name="confirmation" label="confirmation" type="password"/>
            <Field name="contacts" label="contacts" type="text"/>
            <button type="button" onClick={handleAppendedField}>Append!</button>
            {additionalFields.map((item, idx) => (

                <Field key={idx} name={`contacts${idx}`} label={`contacts${idx}`} type="text"/>

            ))
            }
            <button type="submit">Submit!</button>
            <hr/>
            {JSON.stringify(useStore($form), null, 4)}
        </form>
    )
};
submitted.watch(e => {
    e.preventDefault()
})
export default Form;