<template>
    <Authenticated>
        <div class="p-6 lg:p-10 max-w-6xl mx-auto overflow-y-auto h-full">
            <header class="mb-10">
                <h1 class="text-3xl font-bold text-slate-900">
                    Methodology & Data Sources
                </h1>
                <p class="text-slate-500 mt-2">
                    This page documents the origin, scope, and processing of
                    data used in the SDG Performance Analytics Dashboard for
                    Philippine Higher Education Institutions (HEIs).
                </p>
            </header>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div
                    class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm"
                >
                    <div
                        class="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <i class="pi pi-globe text-xl"></i>
                    </div>
                    <h3 class="font-bold text-slate-800">Global Benchmarks</h3>
                    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
                        Primary metrics are extracted from
                        <strong>THE Impact Rankings</strong> and
                        <strong>DataPoints</strong>. These provide standardized
                        comparisons across 17 SDGs using bibliometric and
                        institutional data.
                    </p>
                    <div class="mt-4 pt-4 border-t border-slate-50">
                        <a
                            href="https://www.timeshighereducation.com/datapoints"
                            target="_blank"
                            class="text-xs text-blue-600 font-semibold flex items-center"
                        >
                            Visit THE DataPoints
                            <i class="pi pi-external-link ml-1"></i>
                        </a>
                        <a
                            href="https://www.timeshighereducation.com/impactrankings"
                            target="_blank"
                            class="mt-1 text-xs text-blue-600 font-semibold flex items-center"
                        >
                            Visit THE Impact Rankings
                            <i class="pi pi-external-link ml-1"></i>
                        </a>
                    </div>
                </div>

                <div
                    class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm"
                >
                    <div
                        class="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <i class="pi pi-users text-xl"></i>
                    </div>
                    <h3 class="font-bold text-slate-800">
                        MMSU SDG Research Team
                    </h3>
                    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
                        Data collected from THE DataPoints and other sources are
                        verified by the MMSU SDG Research Team. This validation
                        process ensures that the dashboard accurately reflects
                        specific HEI performance within the 17 SDGs.
                    </p>
                </div>

                <div
                    class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm"
                >
                    <div
                        class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <i class="pi pi-cloud text-xl"></i>
                    </div>
                    <h3 class="font-bold text-slate-800">Supplementary Data</h3>
                    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
                        Aggregated from verified academic repositories and
                        articles online. These external sources are used to
                        augment and provide context for institutional
                        performance trends.
                    </p>
                </div>
            </div>

            <div class="mt-10 p-8 bg-slate-900 rounded-[2rem] text-white">
                <div class="flex items-center space-x-3 mb-4">
                    <i class="pi pi-sync text-blue-400"></i>
                    <h2 class="text-xl font-bold">
                        Data Harmonization Process
                    </h2>
                </div>
                <p class="text-slate-400 text-sm leading-relaxed max-w-3xl">
                    Data from THE Impact Rankings and DataPoints is not used in
                    raw form. It undergoes preprocessing and harmonization
                    before visualization.
                </p>
            </div>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "./../Dashboard Template/Layout/Authenticated.vue";
</script>
