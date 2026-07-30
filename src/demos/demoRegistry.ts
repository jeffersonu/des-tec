import React from 'react';
import { PortfolioProject } from '../types';
import PendingIntegrationView from './PendingIntegrationView';

export interface DemoComponentProps {
  project: PortfolioProject;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onClose?: () => void;
}

/**
 * Registry of modular project demos.
 * Add new integrated project components here when source code is provided.
 */
export const demoRegistry: Record<string, React.ComponentType<DemoComponentProps> | null> = {
  // Integrated Projects with source code loaded in app
  'proj-remodelacionesya': null, // Uses built-in RemodelacionesYa module or custom source
  'proj-financial': null,        // Uses built-in Oracle Finance module
  'proj-cargoflow': null,        // Uses built-in CargoFlow module
  'proj-crm-whatsapp': null,     // Uses built-in AeroSync WhatsApp module
  'proj-apex-crm': null,         // Uses built-in Apex Kanban module
  'proj-auto-invoice': null,     // Uses built-in SmartDoc visualizer module

  // Pending Projects (Will show PendingIntegrationView until code is added)
  'proj-nexustech': null,
  'proj-n8n-workflow': null,
  'proj-medismart-crm': null,
};

/**
 * Helper to get demo component or fallback to PendingIntegrationView
 */
export function getDemoComponent(projectId: string): React.ComponentType<DemoComponentProps> {
  const component = demoRegistry[projectId];
  if (component) {
    return component;
  }
  return PendingIntegrationView;
}
