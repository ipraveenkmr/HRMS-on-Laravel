<?php

namespace App\Support;

class TaskReportPdf
{
    public static function render(array $lines): string
    {
        $wrapped = [];
        foreach ($lines as $line) {
            foreach (explode("\n", wordwrap($line, 100, "\n", true)) as $part) $wrapped[] = $part;
        }
        $pages = array_chunk($wrapped, 48);
        if (!$pages) $pages = [[]];
        $objects = [1 => '<< /Type /Catalog /Pages 2 0 R >>'];
        $pageIds = [];
        $next = 4;
        foreach ($pages as $pageLines) {
            $pageId = $next++;
            $streamId = $next++;
            $pageIds[] = $pageId;
            $stream = "BT /F1 10 Tf 40 800 Td 14 TL\n";
            foreach ($pageLines as $line) {
                $line = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $line) ?: '';
                $line = str_replace(['\\', '(', ')', "\r", "\n"], ['\\\\', '\\(', '\\)', ' ', ' '], $line);
                $stream .= '('.substr($line, 0, 105).") Tj T*\n";
            }
            $stream .= 'ET';
            $objects[$pageId] = "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents $streamId 0 R >>";
            $objects[$streamId] = "<< /Length ".strlen($stream)." >>\nstream\n$stream\nendstream";
        }
        $objects[2] = '<< /Type /Pages /Kids ['.implode(' ', array_map(fn ($id) => "$id 0 R", $pageIds)).'] /Count '.count($pageIds).' >>';
        $objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
        ksort($objects);
        $pdf = "%PDF-1.4\n";
        $offsets = [0];
        foreach ($objects as $id => $body) {
            $offsets[$id] = strlen($pdf);
            $pdf .= "$id 0 obj\n$body\nendobj\n";
        }
        $xref = strlen($pdf);
        $pdf .= 'xref' . "\n0 " . (max(array_keys($objects)) + 1) . "\n0000000000 65535 f \n";
        for ($i = 1; $i <= max(array_keys($objects)); $i++) {
            $pdf .= sprintf('%010d 00000 n ', $offsets[$i] ?? 0)."\n";
        }
        $pdf .= "trailer\n<< /Size ".(max(array_keys($objects)) + 1)." /Root 1 0 R >>\nstartxref\n$xref\n%%EOF";
        return $pdf;
    }
}
