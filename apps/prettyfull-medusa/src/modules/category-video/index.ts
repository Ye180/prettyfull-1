import { Module } from "@medusajs/framework/utils"
import CategoryVideoModuleService from "./service"

export const CATEGORY_VIDEO_MODULE = "categoryVideo"

export default Module(CATEGORY_VIDEO_MODULE, {
  service: CategoryVideoModuleService,
})