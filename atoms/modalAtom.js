import React from 'react'
import { atom } from "recoil";

export const modalState = atom({
    key: 'modalState',
    default: false,
})