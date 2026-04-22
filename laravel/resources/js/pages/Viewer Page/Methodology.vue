<template>
    <Authenticated>
        <div class="p-6 lg:p-10 max-w-6xl mx-auto overflow-y-auto h-full">
            <header class="mb-10">
                <h1 class="text-3xl font-bold text-slate-900">
                    Methodology & Data Sources
                </h1>
                <p class="text-slate-500 mt-2">
                    The framework used to harmonize global metrics with local
                    institutional insights.
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
                    <h3 class="font-bold text-slate-800">MMSU SDG Research</h3>
                    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
                        Localized data and qualitative evidence provided by the
                        <strong>MMSU SDG Research Team</strong>. This ensures
                        the dashboard reflects specific regional impacts and
                        GREEN University initiatives.
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
                        Aggregated from verified academic repositories and the
                        2030 UN Agenda archives. This data serves to augment and
                        validate institutional performance trends.
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
                    Our methodology employs a normalization technique to ensure
                    that data from different sources (Global vs. Local) is
                    comparable. Qualitative evidence from research teams is
                    assigned a weighted score that aligns with the quantitative
                    metrics provided by THE DataPoints, resulting in a single,
                    unified "Alignment Index" for each institution.
                </p>
            </div>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "./../Dashboard Template/Layout/Authenticated.vue";
</script>
