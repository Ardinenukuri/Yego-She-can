"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceController = void 0;
const ResourceService_1 = require("../services/ResourceService");
exports.ResourceController = {
    uploadResource: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { courseId, description, timeline, level, videoLink } = req.body;
            const mentorId = req.user.id;
            const files = req.files;
            const result = yield ResourceService_1.ResourceService.addCourseResource(mentorId, courseId, { description, timeline, level, videoLink }, files);
            res.status(201).json(Object.assign({ message: 'Resource, image, and chapters uploaded successfully' }, result));
        }
        catch (error) {
            next(error);
        }
    })
};
