<template>
    <div
        class="w-full bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden transition-all duration-200"
    >
        <div class="w-full overflow-x-auto scrolling-touch">
            <table class="w-full border-collapse text-left align-middle">
                <thead
                    class="bg-slate-50/75 border-b border-slate-100 select-none"
                >
                    <tr class="hover:bg-slate-50/75 transition-colors">
                        <slot name="header" />
                    </tr>
                </thead>

                <tbody class="divide-y divide-slate-100/80">
                    <slot name="body" />
                </tbody>
            </table>
        </div>
    </div>
</template>
