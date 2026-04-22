<template>
    <Authenticated>
        <div class="space-y-6 border-l-2 border-slate-100 ml-1 pl-4">
            <div>
                <h5 class="text-xs font-semibold text-slate-800">
                    Dynamic Filtering
                </h5>
                <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Interact with any visual element to cross-filter the entire
                    page. Use
                    <kbd class="px-1 py-0.5 bg-white border rounded text-[9px]"
                        >Ctrl + Click</kbd
                    >
                    to select multiple data points simultaneously.
                </p>
            </div>

            <div>
                <h5 class="text-xs font-semibold text-slate-800">
                    Granular Insights
                </h5>
                <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Hover over specific data markers to trigger
                    <strong>Tooltips</strong>. These provide deeper underlying
                    metrics and raw score breakdowns for specific HEIs.
                </p>
            </div>

            <div>
                <h5 class="text-xs font-semibold text-slate-800">
                    Drill-Through Capability
                </h5>
                <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Right-click on categorical charts to "Drill Through" to
                    dedicated sub-pages for detailed SDG alignment narratives.
                </p>
            </div>

            <div>
                <h5 class="text-xs font-semibold text-slate-800">
                    View Optimization
                </h5>
                <p class="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    To revert to the default state, utilize the
                    <i class="pi pi-refresh text-[9px]"></i>
                    <strong>Reset Filters</strong> icon located at the top right
                    of the dashboard canvas.
                </p>
            </div>
        </div>

        <div class="mt-10 pt-6 border-t border-slate-100">
            <h4 class="text-xs font-bold text-slate-800 flex items-center">
                <i class="pi pi-shield mr-2 text-blue-500"></i>
                Data Governance
            </h4>
            <p class="text-[11px] text-slate-500 mt-2 leading-relaxed italic">
                Visualizations are generated from validated
                <strong>THE DataPoints</strong> datasets, harmonized for SDG
                impact analysis.
            </p>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "./Dashboard Template/Layout/Authenticated.vue";
</script>
