<template>
    <Authenticated>
        <div class="p-6 lg:p-10 w-full mx-auto overflow-y-auto h-full">
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

            <!--Data Sources container-->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div
                    class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm"
                >
                    <div
                        class="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <i class="pi pi-globe text-xl"></i>
                    </div>
                    <h3 class="font-bold text-slate-800">THE Websites</h3>
                    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
                        The dashboard is primarily powered by data sourced from
                        <strong>THE Impact Rankings</strong> and
                        <strong>THE DataPoints</strong>. These platforms serve
                        as the core sources for our collection process,
                        providing the standardized bibliometric and
                        institutional data required for analysis across the 17
                        SDGs.
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
                        Following data processing, all data is formally verified
                        by the MMSU SDG Research Team. This critical oversight
                        ensures the dashboard’s analytical insights maintain the
                        highest level of accuracy regarding HEI performance
                        across the 17 SDGs.
                    </p>
                </div>

                <!-- <div
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
                </div> -->
            </div>

            <!--Data Processing container-->
            <div class="mt-10 p-8 bg-slate-900 rounded-[2rem] text-white">
                <div class="flex items-center space-x-3 mb-4">
                    <i class="pi pi-sync text-blue-400"></i>
                    <h2 class="text-xl font-bold">Data Processing</h2>
                </div>
                <p class="text-slate-400 text-sm leading-relaxed max-w-4xl">
                    Data from THE Impact Rankings and DataPoints is not used in
                    raw form. It undergoes preprocessing and transformations
                    before visualization.
                </p>

                <ul class="space-y-5 mt-6">
                    <li class="flex gap-4">
                        <span
                            class="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                        ></span>
                        <div>
                            <p class="font-semibold text-white">
                                Data Extraction from THE Platforms
                            </p>
                            <p class="text-sm text-slate-400">
                                Raw institutional and SDG-related metrics are
                                extracted from THE Impact Rankings and
                                DataPoints covering Philippine HEIs.
                            </p>
                        </div>
                    </li>

                    <li class="flex gap-4">
                        <span
                            class="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                        ></span>
                        <div>
                            <p class="font-semibold text-white">
                                Data Cleaning & Standardization
                            </p>
                            <p class="text-sm text-slate-400">
                                Institutional names, SDG labels, and metric
                                formats are standardized to ensure consistency
                                across datasets and reporting periods.
                            </p>
                        </div>
                    </li>

                    <li class="flex gap-4">
                        <span
                            class="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                        ></span>
                        <div>
                            <p class="font-semibold text-white">
                                SDG Mapping & Classification
                            </p>
                            <p class="text-sm text-slate-400">
                                Extracted metrics are mapped to the 17 UN
                                Sustainable Development Goals based on THE’s
                                indicator framework and classification system.
                            </p>
                        </div>
                    </li>

                    <li class="flex gap-4">
                        <span
                            class="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]"
                        ></span>
                        <div>
                            <p class="font-semibold text-white">
                                Aggregation into SDG Datasets
                            </p>
                            <p class="text-sm text-slate-400">
                                Processed data are aggregated into SDG-level
                                performance metrics, which are then used for
                                visualization within the dashboard.
                            </p>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!--Harmonization Logic-->
                <div
                    class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm"
                >
                    <div
                        class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <i class="pi pi-sliders-h text-xl"></i>
                    </div>
                    <h3 class="font-bold text-slate-800">Data Harmonization</h3>
                    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
                        To ensure seamless <strong>interoperability</strong>,
                        data from various <strong>THE datasets</strong> are
                        aligned for consistency across all institutional
                        indicators. We employ a normalization process to
                        transform diverse naming conventions and reporting
                        structures into a unified schema, enabling
                        high-precision comparison and visualization.
                    </p>
                </div>

                <!--Scope & Limitations-->
                <div
                    class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm"
                >
                    <div
                        class="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <i class="pi pi-exclamation-triangle text-xl"></i>
                    </div>
                    <h3 class="font-bold text-slate-800">
                        Scope & Limitations
                    </h3>
                    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
                        The dashboard’s scope is defined by the data available
                        within <strong>THE Impact Rankings</strong> and
                        <strong>DataPoints</strong>. Consequently,
                        representation is limited to participating Philippine
                        HEIs, and some impact categories may reflect data gaps.
                        These results are a direct output of
                        <strong>THE’s methodology</strong>
                        and are intended for comparative context rather than as
                        independent institutional evaluations.
                    </p>
                </div>

                <!--Update Cycle-->
                <div
                    class="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm"
                >
                    <div
                        class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4"
                    >
                        <i class="pi pi-refresh text-xl"></i>
                    </div>
                    <h3 class="font-bold text-slate-800">Update Cycle</h3>
                    <p class="text-sm text-slate-500 mt-2 leading-relaxed">
                        Data updates follow the release cycle of
                        <strong>THE Impact Rankings</strong> and
                        <strong>DataPoints</strong>. Once new datasets are
                        released, they undergo our internal processing and
                        validation before being reflected in the dashboard.
                        However, all visualized data is subject to ongoing
                        validation to ensure the highest standards of accuracy
                        and performance insight.
                    </p>
                </div>
            </div>
        </div>
    </Authenticated>
</template>
<script setup>
import Authenticated from "./../Dashboard Template/Layout/Authenticated.vue";
</script>
