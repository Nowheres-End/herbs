import path from 'node:path';
import { pathToFileURL } from 'node:url';
const skill='/Users/danielmcshan/.codex/plugins/cache/openai-primary-runtime/presentations/26.1119.11507/skills/presentations';
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const root=path.resolve('herbs');
const result=await finalizePresentation({workspaceDir:root,candidatePath:path.join(root,'.build/draft.pptx'),finalPath:path.join(root,'output/Nowheres-End-Herbarium.pptx'),pythonExecutable:'/Users/danielmcshan/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit'],explicitTotalSlideCount:25,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],fontPolicy:{basis:'design',families:['Georgia','Arial']},verifyArtifactToolImport:true,receiptPath:path.join(root,'.build/Nowheres-End-Herbarium.validation.json')});
console.log(JSON.stringify(result));
