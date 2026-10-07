import type { Page } from '@playwright/test';

export interface DiscoveredElement {
    tag: string;
    role: string | null;
    text: string;
    name: string | null;
    id: string | null;
    type: string | null;
    placeholder: string | null;
    required: boolean;
    disabled: boolean;
    readOnly: boolean;
    ariaLabel: string | null;
    ariaPressed: string | null;
    ariaChecked: string | null;
    ariaExpanded: string | null;
    dataUdaName: string | null;
    dataUdaType: string | null;
}

export class UiDiscovery {
    constructor(private readonly page: Page) { }

    async discover(): Promise<DiscoveredElement[]> {
        return this.page.locator(
            [
                'input',
                'textarea',
                'select',
                'button',
                '[role="button"]',
                '[role="tab"]',
                '[role="checkbox"]',
                '[role="radio"]',
                '[role="combobox"]',
                '[role="listbox"]',
            ].join(','),
        ).evaluateAll((elements) =>
            elements
                .filter((element) => {
                    const html = element as HTMLElement;

                    const style =
                        window.getComputedStyle(html);

                    const rect =
                        html.getBoundingClientRect();

                    return (
                        style.display !== 'none' &&
                        style.visibility !== 'hidden' &&
                        rect.width > 0 &&
                        rect.height > 0
                    );
                })
                .map((element) => {
                    const html =
                        element as HTMLElement;

                    const input =
                        element as HTMLInputElement;

                    return {
                        tag:
                            element.tagName.toLowerCase(),

                        role:
                            element.getAttribute('role'),

                        text:
                            (html.innerText ?? '')
                                .trim()
                                .replace(/\s+/g, ' ')
                                .slice(0, 300),

                        name:
                            element.getAttribute('name'),

                        id:
                            element.id || null,

                        type:
                            element.getAttribute('type'),

                        placeholder:
                            element.getAttribute(
                                'placeholder',
                            ),

                        required:
                            input.required ?? false,

                        disabled:
                            input.disabled ??
                            element.getAttribute(
                                'aria-disabled',
                            ) === 'true',

                        readOnly:
                            input.readOnly ?? false,

                        ariaLabel:
                            element.getAttribute(
                                'aria-label',
                            ),

                        ariaPressed:
                            element.getAttribute(
                                'aria-pressed',
                            ),

                        ariaChecked:
                            element.getAttribute(
                                'aria-checked',
                            ),

                        ariaExpanded:
                            element.getAttribute(
                                'aria-expanded',
                            ),

                        dataUdaName:
                            element.getAttribute(
                                'data-uda-name',
                            ),

                        dataUdaType:
                            element.getAttribute(
                                'data-uda-type',
                            ),
                    };
                }),
        );
    }
}