import { generatePath } from 'react-router-dom';
import { routes } from '@constants';

const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PROD = process.env.NODE_ENV === 'production';

const defaultBasePath = IS_DEV ? undefined : '/react';
// const defaultApiUrl = IS_PROD ? process.env.API_URL : '';
const defaultApiUrl = IS_DEV ? process.env.API_URL : '';

export const BASE_PATH = process.env.BASE_PATH ?? defaultBasePath;
export const SC_URL = process.env.SC_URL!;
export const API_URL = defaultApiUrl;

export const DEFAULT_SYSTEM_ID = 'knowledge_base_IMS' as const;
export const DEFAULT_COMMAND_SYSTEM_ID = 'ui_menu_view_full_semantic_neighborhood' as const;

export const DEFAULT_COMMAND_PATH = generatePath(routes.COMMAND, {
  addr: DEFAULT_SYSTEM_ID,
  commandAddr: DEFAULT_COMMAND_SYSTEM_ID,
  format: 'scn',
});

export const scgUrl = `${API_URL}/scg`;
